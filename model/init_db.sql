DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `students`;

CREATE TABLE students (
     id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
     first_name VARCHAR(255) NOT NULL,
     last_name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     phone VARCHAR(255) NOT NULL,
     tuition DECIMAL(8, 2) NOT NULL,
     enrolled BOOLEAN NOT NULL,
     instrument ENUM(
        'guitar',
        'piano',
        'drums',
        'accordion'
    ) NOT NULL
);
CREATE TABLE payments(
     id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
     student_id INT UNSIGNED NOT NULL,
     payment_date DATE NULL,
     due_date DATE NOT NULL,
     is_paid BOOLEAN NOT NULL,
     FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

INSERT INTO students (first_name, last_name, email, phone, tuition, enrolled, instrument)
VALUES
('John', 'Doe', 'johndoe@example.com', '123-456-7890', 200.00, TRUE, 'guitar'),
('Jane', 'Smith', 'janesmith@example.com', '234-567-8901', 250.00, TRUE, 'piano'),
('Alex', 'Johnson', 'alexjohnson@example.com', '345-678-9012', 180.00, FALSE, 'drums'),
('Emily', 'Davis', 'emilydavis@example.com', '456-789-0123', 300.00, TRUE, 'accordion');

INSERT INTO payments (student_id, payment_date, due_date, is_paid)
VALUES
(1, '2025-02-01', '2025-02-10', TRUE),
(2, '2025-02-03', '2025-02-12', TRUE),
(3, NULL, '2025-02-15', FALSE),  
(4, '2025-02-05', '2025-02-20', TRUE);

