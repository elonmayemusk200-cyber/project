const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
};

const email = body('email')
  .trim()
  .isEmail()
  .normalizeEmail()
  .withMessage('A valid email is required.');

const password = body('password')
  .isString()
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long.');

const name = body('name')
  .trim()
  .isLength({ min: 2, max: 100 })
  .withMessage('Name must be between 2 and 100 characters.');

const phone = body('phone')
  .optional({ nullable: true })
  .trim()
  .isLength({ max: 30 })
  .withMessage('Phone number must be 30 characters or fewer.');

const address = body('address')
  .optional({ nullable: true })
  .trim()
  .isLength({ max: 500 })
  .withMessage('Address must be 500 characters or fewer.');

const city = body('city')
  .optional({ nullable: true })
  .trim()
  .isLength({ max: 100 })
  .withMessage('City must be 100 characters or fewer.');

const state = body('state')
  .optional({ nullable: true })
  .trim()
  .isLength({ max: 100 })
  .withMessage('State must be 100 characters or fewer.');

const country = body('country')
  .optional({ nullable: true })
  .trim()
  .isLength({ max: 100 })
  .withMessage('Country must be 100 characters or fewer.');

const currentPassword = body('currentPassword')
  .isString()
  .isLength({ min: 8 })
  .withMessage('Current password must be at least 8 characters long.');

const newPassword = body('newPassword')
  .isString()
  .isLength({ min: 8 })
  .withMessage('New password must be at least 8 characters long.');

const token = body('token')
  .trim()
  .isLength({ min: 16 })
  .withMessage('A valid token is required.');

const message = body('message')
  .trim()
  .isLength({ min: 10, max: 5000 })
  .withMessage('Message must be between 10 and 5000 characters.');

const subject = body('subject')
  .optional({ nullable: true })
  .trim()
  .isLength({ max: 255 })
  .withMessage('Subject must be 255 characters or fewer.');

const shipmentId = body('shipment_id')
  .optional({ nullable: true })
  .custom((value) => value === null || value === '' || Number.isInteger(Number(value)))
  .withMessage('Shipment ID must be a valid integer.');

const adminLoginValidation = [email, password, handleValidationErrors];
const adminChangePasswordValidation = [currentPassword, newPassword, handleValidationErrors];

const customerRegisterValidation = [name, email, password, phone, address, city, state, country, handleValidationErrors];
const customerLoginValidation = [email, password, handleValidationErrors];
const customerVerifyEmailValidation = [token, handleValidationErrors];
const customerForgotPasswordValidation = [email, handleValidationErrors];
const customerResetPasswordValidation = [token, password, handleValidationErrors];
const customerProfileValidation = [name.optional({ nullable: true }), phone, address, city, state, country, handleValidationErrors];
const customerSupportValidation = [subject, shipmentId, message, handleValidationErrors];
const contactValidation = [name, email, phone, subject, message, handleValidationErrors];

module.exports = {
  handleValidationErrors,
  adminLoginValidation,
  adminChangePasswordValidation,
  customerRegisterValidation,
  customerLoginValidation,
  customerVerifyEmailValidation,
  customerForgotPasswordValidation,
  customerResetPasswordValidation,
  customerProfileValidation,
  customerSupportValidation,
  contactValidation,
};
