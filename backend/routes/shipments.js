const router = require('express').Router();
const ctrl = require('../controllers/shipmentController');
const { authenticateAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/track/:trackingId', ctrl.trackShipment);

// Protected
router.use(authenticateAdmin);
router.get('/stats/dashboard', ctrl.getDashboardStats);
router.get('/', ctrl.getShipments);
router.get('/:id', ctrl.getShipment);
router.post('/', ctrl.createShipment);
router.put('/:id', ctrl.updateShipment);
router.delete('/:id', ctrl.deleteShipment);
router.post('/:id/events', ctrl.addTrackingEvent);
router.post('/:id/media', upload.single('file'), ctrl.uploadMedia);
router.delete('/:id/media/:mediaId', ctrl.deleteMedia);

module.exports = router;