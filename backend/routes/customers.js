const router = require('express').Router();
const ctrl = require('../controllers/customerController');
const { authenticateCustomer } = require('../middleware/auth');
const documentUpload = require('../middleware/documentUpload');
const {
  customerRegisterValidation,
  customerLoginValidation,
  customerVerifyEmailValidation,
  customerForgotPasswordValidation,
  customerResetPasswordValidation,
  customerProfileValidation,
  customerSupportValidation,
} = require('../middleware/validation');

router.post('/register', customerRegisterValidation, ctrl.register);
router.post('/login', customerLoginValidation, ctrl.login);
router.post('/verify-email', customerVerifyEmailValidation, ctrl.verifyEmail);
router.post('/forgot-password', customerForgotPasswordValidation, ctrl.forgotPassword);
router.post('/reset-password', customerResetPasswordValidation, ctrl.resetPassword);

router.use(authenticateCustomer);
router.get('/me', ctrl.getMe);
router.put('/profile', customerProfileValidation, ctrl.updateProfile);
router.get('/dashboard', ctrl.dashboard);
router.get('/shipments', ctrl.getShipments);
router.get('/shipments/:id', ctrl.getShipment);
router.post('/shipments/:shipmentId/documents', documentUpload.single('file'), ctrl.uploadDocument);
router.get('/notifications', ctrl.getNotifications);
router.put('/notifications/:id/read', ctrl.markNotificationRead);
router.post('/support', customerSupportValidation, ctrl.contactSupport);

module.exports = router;
