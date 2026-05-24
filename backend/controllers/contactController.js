const { pool } = require('../config/database');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const [contactResult] = await pool.execute(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?,?,?,?,?)',
      [name, email, phone || null, subject || null, message]
    );

    const [customers] = await pool.execute('SELECT id, name, email FROM customers WHERE email = ?', [email]);
    const customer = customers[0] || null;

    const [ticketResult] = await pool.execute(
      `INSERT INTO customer_support_tickets
        (customer_id, customer_name, customer_email, customer_phone, shipment_id, subject, message, status, priority, channel, issue_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer?.id || null,
        customer?.name || name,
        customer?.email || email,
        phone || null,
        null,
        subject || 'General inquiry',
        message,
        'open',
        'normal',
        'web',
        'general_inquiry'
      ]
    );

    await pool.execute(
      'INSERT INTO support_ticket_messages (ticket_id, sender_type, sender_id, message) VALUES (?, ?, ?, ?)',
      [ticketResult.insertId, 'customer', customer?.id || null, message]
    );

    res.status(201).json({
      success: true,
      message: 'Message received. We will contact you shortly.',
      contact_id: contactResult.insertId,
      ticket_id: ticketResult.insertId
    });
  } catch (err) {
    console.error('Contact submit error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const [messages] = await pool.execute(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.markRead = async (req, res) => {
  try {
    await pool.execute('UPDATE contact_messages SET is_read = TRUE WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};