const router = require('express').Router();
const ctrl = require('../controllers/contactController');
const { authenticateAdmin } = require('../middleware/auth');
const { contactValidation } = require('../middleware/validation');

router.post('/', contactValidation, ctrl.submitContact);
router.get('/', authenticateAdmin, ctrl.getMessages);
router.put('/:id/read', authenticateAdmin, ctrl.markRead);

module.exports = router;