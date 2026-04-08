-- Sample Users for Event Booking System
-- Passwords (all set to "password123" for testing):
-- admin@eventbooking.com -> $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- user@example.com -> $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- john@example.com -> $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- sarah@example.com -> $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Check if database exists, if not create it
CREATE DATABASE IF NOT EXISTS event_booking_db;
USE event_booking_db;

-- Clear existing users (to avoid duplicates on re-run)
DELETE FROM users WHERE email IN ('admin@eventbooking.com', 'user@example.com', 'john@example.com', 'sarah@example.com');

-- Insert Admin User
INSERT INTO users (full_name, email, password, role, created_at, updated_at) 
VALUES ('Admin User', 'admin@eventbooking.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', NOW(), NOW());

-- Insert Regular Users
INSERT INTO users (full_name, email, password, role, created_at, updated_at) 
VALUES ('John Doe', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', NOW(), NOW());

INSERT INTO users (full_name, email, password, role, created_at, updated_at) 
VALUES ('Sarah Smith', 'sarah@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', NOW(), NOW());

INSERT INTO users (full_name, email, password, role, created_at, updated_at) 
VALUES ('Test User', 'user@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', NOW(), NOW());

-- Verify insertion
SELECT id, full_name, email, role FROM users WHERE email IN ('admin@eventbooking.com', 'john@example.com', 'sarah@example.com', 'user@example.com');
