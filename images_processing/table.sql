CREATE DATABASE IF NOT EXISTS your_db_name;
USE your_db_name;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL
);

INSERT INTO users (email) VALUES ('test1@example.com'), ('test2@example.com');
