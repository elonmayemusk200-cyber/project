const router = require('express').Router();
const ctrl = require('../controllers/supportController');
const { authenticateAdmin } = require('../middleware/auth');

router.use(authenticateAdmin);

router.get('/stats', ctrl.getSupportStats);
router.get('/agents', ctrl.getSupportAgents);
router.get('/tickets', ctrl.getSupportTickets);
router.get('/tickets/:id', ctrl.getSupportTicket);
router.get('/tickets/:id/messages', ctrl.getSupportTicketMessages);
router.patch('/tickets/:id/status', ctrl.updateSupportTicketStatus);
router.patch('/tickets/:id/assign', ctrl.assignSupportTicket);
router.post('/tickets/:id/reply', ctrl.replyToSupportTicket);

module.exports = router;
