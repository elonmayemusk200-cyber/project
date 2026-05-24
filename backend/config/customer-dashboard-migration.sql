USE midwest_shipment;

CREATE TABLE IF NOT EXISTS customers (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(120) NOT NULL,
  email          VARCHAR(150) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  phone          VARCHAR(30),
  address        TEXT,
  city           VARCHAR(100),
  state          VARCHAR(100),
  country        VARCHAR(100) DEFAULT 'USA',
  email_verified BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer_email_verifications (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id INT UNSIGNED NOT NULL,
  token       VARCHAR(100) NOT NULL UNIQUE,
  expires_at  DATETIME NOT NULL,
  used_at     DATETIME,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer_password_resets (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id INT UNSIGNED NOT NULL,
  token       VARCHAR(100) NOT NULL UNIQUE,
  expires_at  DATETIME NOT NULL,
  used_at     DATETIME,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

ALTER TABLE shipments
  ADD COLUMN customer_id INT UNSIGNED NULL AFTER tracking_id;

ALTER TABLE shipments
  ADD CONSTRAINT fk_shipments_customer
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS customer_delivery_documents (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id   INT UNSIGNED NOT NULL,
  shipment_id   INT UNSIGNED NOT NULL,
  document_type VARCHAR(80) DEFAULT 'delivery_document',
  filename      VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  file_size     INT UNSIGNED,
  mime_type     VARCHAR(100),
  uploaded_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer_notifications (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id INT UNSIGNED NOT NULL,
  title       VARCHAR(150) NOT NULL,
  message     TEXT NOT NULL,
  type        ENUM('info','success','warning','error') DEFAULT 'info',
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer_support_tickets (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id INT UNSIGNED NOT NULL,
  shipment_id INT UNSIGNED,
  subject     VARCHAR(180),
  message     TEXT NOT NULL,
  status      ENUM('open','in_review','closed') DEFAULT 'open',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_shipments_customer     ON shipments(customer_id);
CREATE INDEX idx_customer_docs_customer ON customer_delivery_documents(customer_id);
CREATE INDEX idx_customer_notifs        ON customer_notifications(customer_id, is_read);
