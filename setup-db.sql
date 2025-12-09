CREATE DATABASE IF NOT EXISTS my_app_db;

-- Create dedicated database user with password authentication
CREATE USER IF NOT EXISTS 'appuser'@'localhost' IDENTIFIED BY 'apppass123';
GRANT ALL PRIVILEGES ON my_app_db.* TO 'appuser'@'localhost';
FLUSH PRIVILEGES;

USE my_app_db;


-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  category VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create places_listed table (fixed syntax)
CREATE TABLE IF NOT EXISTS places_listed (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    item_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES inventory(id) ON DELETE CASCADE
);

-- Create index on name for faster lookups
CREATE INDEX idx_inventory_name ON inventory(name);
CREATE INDEX idx_inventory_category ON inventory(category);

-- Example: Insert a test user (password is 'password123')
-- Note: Use the hash-password.js script to generate password hashes
INSERT IGNORE INTO users (email, password_hash) 
VALUES ('user@example.com', '$2b$10$rN5X8vFzVGxJvGxZVxJvGu1mQH5Y5H5H5H5H5H5H5H5H5H5H5H5H5');

-- Example inventory items
INSERT INTO inventory (name, quantity, price, category, description) VALUES
  ('Laptop', 10, 999.99, 'Electronics', 'High-performance laptop'),
  ('Office Chair', 25, 199.99, 'Furniture', 'Ergonomic office chair'),
  ('Notebook', 100, 5.99, 'Stationery', 'Spiral-bound notebook'),
  ('Desk Lamp', 15, 29.99, 'Electronics', 'LED desk lamp'),
  ('Mouse', 50, 24.99, 'Electronics', 'Wireless mouse');
