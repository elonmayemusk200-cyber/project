USE midwest_shipment;

ALTER TABLE shipments
  MODIFY status ENUM(
    'pending',
    'on_hold',
    'cancelled',
    'processing',
    'picked_up',
    'in_transit',
    'customs_clearance',
    'arrived_at_facility',
    'out_for_delivery',
    'delivered',
    'failed_delivery'
  ) DEFAULT 'processing';

UPDATE shipments SET status = 'processing' WHERE status IN ('pending', 'on_hold', 'cancelled');

ALTER TABLE shipments
  MODIFY status ENUM(
    'processing',
    'picked_up',
    'in_transit',
    'customs_clearance',
    'arrived_at_facility',
    'out_for_delivery',
    'delivered',
    'failed_delivery'
  ) DEFAULT 'processing';

CREATE TABLE IF NOT EXISTS shipment_activity_logs (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  shipment_id   INT UNSIGNED NOT NULL,
  action        VARCHAR(100) NOT NULL,
  details       JSON,
  created_by    INT UNSIGNED,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by)  REFERENCES admins(id)    ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_activity_logs_ship ON shipment_activity_logs(shipment_id);
