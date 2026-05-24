const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../config/database');

const publicCustomerFields = 'id, name, email, phone, address, city, state, country, email_verified, created_at';

const generateCustomerToken = (customer) => {
  return jwt.sign(
    { id: customer.id, email: customer.email, type: 'customer' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const createToken = () => crypto.randomBytes(32).toString('hex');

const sanitizeCustomer = (customer) => ({
  id: customer.id,
  name: customer.name,
  email: customer.email,
  phone: customer.phone,
  address: customer.address,
  city: customer.city,
  state: customer.state,
  country: customer.country,
  email_verified: Boolean(customer.email_verified),
  created_at: customer.created_at,
});

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address, city, state, country } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const [existing] = await pool.execute('SELECT id FROM customers WHERE email = ?', [normalizedEmail]);
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'An account already exists with this email.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      `INSERT INTO customers (name, email, password_hash, phone, address, city, state, country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, normalizedEmail, passwordHash, phone || null, address || null, city || null, state || null, country || 'USA']
    );

    const verificationToken = createToken();
    await pool.execute(
      `INSERT INTO customer_email_verifications (customer_id, token, expires_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))`,
      [result.insertId, verificationToken]
    );

    await pool.execute(
      'UPDATE shipments SET customer_id = ? WHERE recipient_email = ? OR sender_email = ?',
      [result.insertId, normalizedEmail, normalizedEmail]
    );

    const [rows] = await pool.execute(`SELECT ${publicCustomerFields} FROM customers WHERE id = ?`, [result.insertId]);
    const customer = rows[0];

    res.status(201).json({
      success: true,
      message: 'Customer account created. Use the verification token to verify email.',
      token: generateCustomerToken(customer),
      customer: sanitizeCustomer(customer),
      verification_token: verificationToken,
    });
  } catch (err) {
    console.error('Customer register error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const [rows] = await pool.execute('SELECT * FROM customers WHERE email = ?', [email.trim().toLowerCase()]);
    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const customer = rows[0];
    const valid = await bcrypt.compare(password, customer.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    res.json({
      success: true,
      token: generateCustomerToken(customer),
      customer: sanitizeCustomer(customer),
    });
  } catch (err) {
    console.error('Customer login error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, customer: sanitizeCustomer(req.customer) });
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Verification token is required.' });

    const [rows] = await pool.execute(
      `SELECT * FROM customer_email_verifications
       WHERE token = ? AND used_at IS NULL AND expires_at > NOW()`,
      [token]
    );

    if (!rows.length) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token.' });
    }

    await pool.execute('UPDATE customers SET email_verified = TRUE WHERE id = ?', [rows[0].customer_id]);
    await pool.execute('UPDATE customer_email_verifications SET used_at = NOW() WHERE id = ?', [rows[0].id]);

    res.json({ success: true, message: 'Email verified successfully.' });
  } catch (err) {
    console.error('Verify email error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

    const [rows] = await pool.execute('SELECT id FROM customers WHERE email = ?', [email.trim().toLowerCase()]);
    if (!rows.length) {
      return res.json({ success: true, message: 'If that email exists, a reset token has been generated.' });
    }

    const resetToken = createToken();
    await pool.execute(
      `INSERT INTO customer_password_resets (customer_id, token, expires_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))`,
      [rows[0].id, resetToken]
    );

    res.json({
      success: true,
      message: 'Password reset token generated.',
      reset_token: resetToken,
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ success: false, message: 'Token and new password are required.' });
    if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });

    const [rows] = await pool.execute(
      `SELECT * FROM customer_password_resets
       WHERE token = ? AND used_at IS NULL AND expires_at > NOW()`,
      [token]
    );
    if (!rows.length) return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });

    const hash = await bcrypt.hash(password, 12);
    await pool.execute('UPDATE customers SET password_hash = ? WHERE id = ?', [hash, rows[0].customer_id]);
    await pool.execute('UPDATE customer_password_resets SET used_at = NOW() WHERE id = ?', [rows[0].id]);

    res.json({ success: true, message: 'Password reset successfully.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'address', 'city', 'state', 'country'];
    const updates = [];
    const values = [];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(req.body[field] || null);
      }
    });

    if (!updates.length) return res.status(400).json({ success: false, message: 'No profile fields provided.' });

    values.push(req.customer.id);
    await pool.execute(`UPDATE customers SET ${updates.join(', ')} WHERE id = ?`, values);
    const [rows] = await pool.execute(`SELECT ${publicCustomerFields} FROM customers WHERE id = ?`, [req.customer.id]);

    res.json({ success: true, message: 'Profile updated.', customer: sanitizeCustomer(rows[0]) });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const params = [req.customer.id, req.customer.email, req.customer.email];
    const ownership = '(customer_id = ? OR recipient_email = ? OR sender_email = ?)';

    const [summaryRows] = await pool.execute(
      `SELECT
        COUNT(*) as total,
        SUM(status = 'delivered') as delivered,
        SUM(status IN ('processing','picked_up','in_transit','customs_clearance','arrived_at_facility','out_for_delivery')) as active,
        SUM(status = 'failed_delivery') as attention
       FROM shipments WHERE ${ownership}`,
      params
    );

    const [recentShipments] = await pool.execute(
      `SELECT id, tracking_id, recipient_name, recipient_city, recipient_country, status, current_location, estimated_delivery, updated_at
       FROM shipments
       WHERE ${ownership}
       ORDER BY updated_at DESC
       LIMIT 5`,
      params
    );

    const [notifications] = await pool.execute(
      'SELECT * FROM customer_notifications WHERE customer_id = ? ORDER BY created_at DESC LIMIT 5',
      [req.customer.id]
    );

    res.json({
      success: true,
      summary: {
        total: Number(summaryRows[0].total || 0),
        delivered: Number(summaryRows[0].delivered || 0),
        active: Number(summaryRows[0].active || 0),
        attention: Number(summaryRows[0].attention || 0),
      },
      recentShipments,
      notifications,
    });
  } catch (err) {
    console.error('Customer dashboard error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getShipments = async (req, res) => {
  try {
    const { search } = req.query;
    const params = [req.customer.id, req.customer.email, req.customer.email];
    let where = '(customer_id = ? OR recipient_email = ? OR sender_email = ?)';

    if (search) {
      where += ' AND (tracking_id LIKE ? OR recipient_name LIKE ? OR current_location LIKE ?)';
      const q = `%${search}%`;
      params.push(q, q, q);
    }

    const [shipments] = await pool.execute(
      `SELECT id, tracking_id, sender_name, recipient_name, recipient_city, recipient_country,
              service_type, status, current_location, ship_date, estimated_delivery, updated_at
       FROM shipments
       WHERE ${where}
       ORDER BY updated_at DESC`,
      params
    );

    res.json({ success: true, shipments });
  } catch (err) {
    console.error('Customer shipments error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT * FROM shipments
       WHERE id = ? AND (customer_id = ? OR recipient_email = ? OR sender_email = ?)`,
      [id, req.customer.id, req.customer.email, req.customer.email]
    );

    if (!rows.length) return res.status(404).json({ success: false, message: 'Shipment not found.' });

    const shipment = rows[0];
    delete shipment.admin_notes;

    const [events] = await pool.execute(
      'SELECT * FROM tracking_events WHERE shipment_id = ? ORDER BY event_time DESC',
      [id]
    );
    const [documents] = await pool.execute(
      'SELECT id, document_type, original_name, uploaded_at FROM customer_delivery_documents WHERE shipment_id = ? AND customer_id = ? ORDER BY uploaded_at DESC',
      [id, req.customer.id]
    );

    res.json({ success: true, shipment, events, documents });
  } catch (err) {
    console.error('Customer shipment detail error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { document_type } = req.body;

    if (!req.file) return res.status(400).json({ success: false, message: 'Document file is required.' });

    const [rows] = await pool.execute(
      `SELECT id FROM shipments
       WHERE id = ? AND (customer_id = ? OR recipient_email = ? OR sender_email = ?)`,
      [shipmentId, req.customer.id, req.customer.email, req.customer.email]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Shipment not found.' });

    await pool.execute(
      `INSERT INTO customer_delivery_documents
       (customer_id, shipment_id, document_type, filename, original_name, file_size, mime_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.customer.id,
        shipmentId,
        document_type || 'delivery_document',
        req.file.filename,
        req.file.originalname,
        req.file.size,
        req.file.mimetype,
      ]
    );

    await pool.execute(
      `INSERT INTO customer_notifications (customer_id, title, message, type)
       VALUES (?, ?, ?, ?)`,
      [req.customer.id, 'Document uploaded', 'Your delivery document was uploaded successfully.', 'success']
    );

    res.status(201).json({ success: true, message: 'Document uploaded successfully.' });
  } catch (err) {
    console.error('Upload customer document error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const [notifications] = await pool.execute(
      'SELECT * FROM customer_notifications WHERE customer_id = ? ORDER BY created_at DESC',
      [req.customer.id]
    );
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    await pool.execute(
      'UPDATE customer_notifications SET is_read = TRUE WHERE id = ? AND customer_id = ?',
      [req.params.id, req.customer.id]
    );
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.contactSupport = async (req, res) => {
  try {
    const { subject, message, shipment_id } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required.' });

    await pool.execute(
      `INSERT INTO customer_support_tickets (customer_id, shipment_id, subject, message)
       VALUES (?, ?, ?, ?)`,
      [req.customer.id, shipment_id || null, subject || 'Customer support request', message]
    );

    await pool.execute(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?,?,?,?,?)',
      [req.customer.name, req.customer.email, req.customer.phone || null, subject || 'Customer support request', message]
    );

    res.status(201).json({ success: true, message: 'Support request sent.' });
  } catch (err) {
    console.error('Customer support error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
