---------------------------------------------------------------(User Module)-------------------------------------------------------------------------------------
-- 1. Users table
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL, 
    failed_logins INT DEFAULT 0,
    is_thief BOOLEAN DEFAULT FALSE
);


-- 2. Houses table
CREATE TABLE Houses (
    house_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    longitude DECIMAL NOT NULL,
    latitude DECIMAL NOT NULL,
    government VARCHAR(255) NOT NULL, 
    city VARCHAR(255) NOT NULL,        
    address VARCHAR(255) NOT NULL,     
    UNIQUE (user_id)               
);


-- 3. Sensors table
CREATE TABLE Sensors (
    sensor_id SERIAL PRIMARY KEY,
    sensor_type VARCHAR(50) NOT NULL CHECK (sensor_type IN ('Movement Detector', 'Door Sensor'))
);

-- 4. Rooms table
CREATE TABLE Rooms (
    room_id SERIAL PRIMARY KEY,
    house_id INT REFERENCES Houses(house_id) ON DELETE CASCADE,
    room_name VARCHAR(50) NOT NULL,
    sensor_id INT REFERENCES Sensors(sensor_id) ON DELETE CASCADE
);

-- 5. Furniture table
CREATE TABLE Furniture (
    furniture_id SERIAL PRIMARY KEY,
    room_id INT REFERENCES Rooms(room_id) ON DELETE CASCADE,
    furniture_name VARCHAR(50) NOT NULL,
    sensor_id INT REFERENCES Sensors(sensor_id)
);


-------------------------------------------------------------(Security Module)-------------------------------------------------------------------------------------

CREATE TABLE employees (
	emp_id SERIAL PRIMARY KEY,
	fname VARCHAR(50) NOT NULL,
	Lname VARCHAR(50) NOT NULL,
	ssn INT UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'security_emp')),
	emp_username VARCHAR(50) UNIQUE NOT NULL,
	emp_password VARCHAR(50) NOT NULL
);

DROP TABLE employees

INSERT INTO employees (fname , lname ,ssn , role , emp_username, emp_password) VALUES('fadss',NULL,12134,'admin','12','123')



-- 6. Theft_Logs table (to log unauthorized access events)
CREATE TABLE Theft_Logs (
    log_id SERIAL PRIMARY KEY,
    house_id INT REFERENCES Houses(house_id),  -- Add the house_id field and reference it
    user_id INT REFERENCES Users(user_id),
    room_id INT REFERENCES Rooms(room_id),
    action_taken VARCHAR(255),
    log_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);



-- 7. Police_Tracking table (for monitoring by police)
CREATE TABLE Police_Tracking (
    track_id SERIAL PRIMARY KEY,
    theft_log_id INT REFERENCES Theft_Logs(log_id),  -- Reference to the Theft Log
    resolved BOOLEAN DEFAULT FALSE,  -- Default to false, indicating it's not resolved
    resolved_timestamp TIMESTAMPTZ  -- The timestamp when it's marked resolved (optional)
);

-------------------------------------------------------------(Admin Module)-------------------------------------------------------------------------------------

--8.Gov Table
CREATE TABLE governments(

	gov_id SERIAL PRIMARY KEY,
	gov_name VARCHAR(50)
);


--9.District Table
CREATE TABLE Districts(
	dist_ID SERIAL PRIMARY KEY,
	dist_name VARCHAR(255) NOT NULL UNIQUE,
	gov_id INTEGER REFERENCES governments(gov_id) ON DELETE CASCADE	
);




--------------------------------------------------------------------------------





SELECT * FROM rooms WHERE house_id = 3

SELECT * FROM houses
SELECT * from sensors
SELECT * from furniture
SELECT * from users
SELECT * from theft_logs
DELETE FROM furniture WHERE furniture_id IN (5);

DROP TABLE furniture CASCADE;
SELECT "furniture_id", "room_id", "furniture_name" FROM "furniture" AS "furniture";
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    character_maximum_length 
FROM 
    information_schema.columns 
WHERE 
    table_name = 'sensors';

 SELECT "furniture_id", "room_id", "furniture_name", "sensor_id" FROM "furniture" AS "furniture" WHERE "furniture"."room_id" = 10 AND "furniture"."furniture_name" = 'laptop' LIMIT 1

ALTER TABLE Rooms DROP CONSTRAINT rooms_sensor_id_fkey;
ALTER TABLE Rooms ADD CONSTRAINT rooms_sensor_id_fkey FOREIGN KEY (sensor_id) REFERENCES Sensors(sensor_id) ON DELETE CASCADE;
