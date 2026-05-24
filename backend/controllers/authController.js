const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const generateToken = (admin) => {
  return jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    
    const [rows] = await pool.execute('SELECT * FROM admins WHERE email = ?', [email]);
    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    
    const admin = rows[0];
    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    
    const token = generateToken(admin);
    res.json({
      success: true,
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const [rows] = await pool.execute('SELECT * FROM admins WHERE id = ?', [req.admin.id]);
    const admin = rows[0];
    
    const isValid = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }
    
    const hash = await bcrypt.hash(newPassword, 12);
    await pool.execute('UPDATE admins SET password_hash = ? WHERE id = ?', [hash, req.admin.id]);
    
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};