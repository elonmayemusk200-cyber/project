const { v4: uuidv4 } = require('uuid');

const generateTrackingId = async (pool) => {
  let trackingId;
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    const chars = uuidv4().replace(/-/g, '').toUpperCase().substring(0, 10);
    trackingId = `MSC-${chars}`;
    
    const [rows] = await pool.execute(
      'SELECT id FROM shipments WHERE tracking_id = ?', [trackingId]
    );
    
    if (!rows.length) isUnique = true;
    attempts++;
  }

  if (!isUnique) throw new Error('Could not generate unique tracking ID');
  return trackingId;
};

const TRACKING_STATUSES = [
  'processing',
  'picked_up',
  'in_transit',
  'customs_clearance',
  'arrived_at_facility',
  'out_for_delivery',
  'delivered',
  'failed_delivery',
];

const STATUS_LABELS = {
  processing: 'Processing',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  customs_clearance: 'Customs Clearance',
  arrived_at_facility: 'Arrived at Facility',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  failed_delivery: 'Failed Delivery',
};

const STATUS_MESSAGES = {
  processing: 'Shipment is being processed.',
  picked_up: 'Shipment has been picked up.',
  in_transit: 'Shipment is in transit.',
  customs_clearance: 'Shipment is undergoing customs clearance.',
  arrived_at_facility: 'Shipment has arrived at a carrier facility.',
  out_for_delivery: 'Shipment is out for delivery.',
  delivered: 'Shipment has been delivered successfully.',
  failed_delivery: 'Delivery attempt failed. A follow-up action is required.',
};

module.exports = { generateTrackingId, TRACKING_STATUSES, STATUS_LABELS, STATUS_MESSAGES };
