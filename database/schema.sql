CREATE DATABASE train_reservation;

USE train_reservation;

CREATE TABLE seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seat_number INT,
  is_booked BOOLEAN DEFAULT FALSE
);
