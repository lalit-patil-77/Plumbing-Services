DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS plumbers;

CREATE TABLE bookings (
  id INT NOT NULL AUTO_INCREMENT,
  custName VARCHAR(255) NOT NULL,
  custMobile VARCHAR(15) NOT NULL,
  custAddress TEXT NOT NULL,
  plumberName VARCHAR(255) NOT NULL,
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  booking_time TIME DEFAULT NULL,
  status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
  amount DECIMAL(10,2) DEFAULT 0.00,
  problem TEXT DEFAULT NULL,
  PRIMARY KEY (id)
);

INSERT INTO bookings
(id, custName, custMobile, custAddress, plumberName, booking_date, booking_time, status, amount, problem)
VALUES
(2, 'lalit patil', '7447746511', 'ff', 'Vikas jadhav (Fitting Pro)', '2026-03-19 11:35:19', NULL, 'Pending', 0.00, NULL);


CREATE TABLE plumbers (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  exp VARCHAR(50) DEFAULT NULL,
  status ENUM('Available', 'Booked', 'Absent') DEFAULT 'Available',
  photo_url VARCHAR(255) DEFAULT NULL,
  experience_years INT DEFAULT NULL,
  PRIMARY KEY (id)
);

INSERT INTO plumbers
(id, name, exp, status, photo_url, experience_years)
VALUES
(1, 'Rahul Patil (TechLead)', '8 years', 'Available', NULL, NULL),
(2, 'Vikas jadhav (Fitting Pro)', '5 years', 'Available', NULL, NULL),
(3, 'Amit Shinde (RobotOps)', '12 years', 'Available', NULL, NULL),
(4, 'Sunil More (RapidResponse)', '4 years', 'Available', NULL, NULL),
(5, 'Dinesh Kulkarni (Project Lead)', '15 years', 'Available', NULL, NULL);