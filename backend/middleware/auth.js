const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [rows] = await pool.execute(
      'SELECT id, name, email, role FROM admins WHERE id = ?',
      [decoded.id]
    );
    
    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Invalid token. Admin not found.' });
    }
    
    req.admin = rows[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

const requireSuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({ success: false, message: 'Super admin access required.' });
  }
  next();
};

const authenticateCustomer = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== 'customer') {
      return res.status(401).json({ success: false, message: 'Invalid customer token.' });
    }

    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, address, city, state, country, email_verified, created_at FROM customers WHERE id = ?',
      [decoded.id]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Invalid token. Customer not found.' });
    }

    req.customer = rows[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

module.exports = { authenticateAdmin, requireSuperAdmin, authenticateCustomer };
