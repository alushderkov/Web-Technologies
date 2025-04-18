CREATE DATABASE cities_game;
USE cities_game;

CREATE TABLE cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    used BOOLEAN DEFAULT FALSE
) CHARACTER SET utf8mb4;

INSERT INTO cities (name) VALUES
    ('Moscow'), ('Anapa'), ('Amsterdam'),
    ('Madrid'), ('Dublin'), ('Novosibirsk'),
    ('Kiev'), ('Warsaw'), ('Astana'),
    ('Minsk');

SELECT * FROM cities;  -- Проверяем, что города добавились