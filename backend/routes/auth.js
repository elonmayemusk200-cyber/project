const router = require('express').Router();
const { login, getMe, changePassword } = require('../controllers/authController');
const { authenticateAdmin } = require('../middleware/auth');
const { adminLoginValidation, adminChangePasswordValidation } = require('../middleware/validation');

router.post('/login', adminLoginValidation, login);
router.get('/me', authenticateAdmin, getMe);
router.put('/change-password', authenticateAdmin, adminChangePasswordValidation, changePassword);

module.exports = router;