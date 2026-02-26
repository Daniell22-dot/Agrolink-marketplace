-- Monitoring table: logs API calls, errors, and performance
CREATE TABLE IF NOT EXISTS monitoring_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  message TEXT,
  user_id INT,
  endpoint VARCHAR(255),
  status_code INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Backup table: stores backup metadata (not actual data dump)
CREATE TABLE IF NOT EXISTS backup_metadata (
  id INT AUTO_INCREMENT PRIMARY KEY,
  backup_type ENUM('full','incremental') NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Caching table: for storing key-value cache (if Redis unavailable)
CREATE TABLE IF NOT EXISTS cache_store (
  cache_key VARCHAR(255) PRIMARY KEY,
  cache_value JSON,
  expires_at DATETIME
);
