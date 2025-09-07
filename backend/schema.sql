-- schema.sql
-- Civic-Sense Database Schema

-- Drop tables if they exist (for development resets)
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS issue_updates CASCADE;
DROP TABLE IF EXISTS issues CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- hashed password
    role VARCHAR(50) DEFAULT 'citizen', -- citizen, authority, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Issues table (reported civic problems)
CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100), -- Road, Water, Garbage, Electricity, Manholes, Water Shortage, Street Lights, Other
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, In Progress, Resolved
    location VARCHAR(255),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    image_url TEXT,
    upvotes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Updates by authorities on an issue
CREATE TABLE issue_updates (
    id SERIAL PRIMARY KEY,
    issue_id INT REFERENCES issues(id) ON DELETE CASCADE,
    updated_by INT REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL,
    message TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments (citizens/authorities can comment on issues)
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    issue_id INT REFERENCES issues(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
