-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Create the music table
CREATE TABLE music (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    artist VARCHAR(100) NOT NULL,
    s3_url VARCHAR(255) NOT NULL
);

-- Create the library table
CREATE TABLE library (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    music_id INT REFERENCES music(id) ON DELETE CASCADE
);

-- Indexes for faster queries
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_music_title ON music(title);
CREATE INDEX idx_library_user_id ON library(user_id);