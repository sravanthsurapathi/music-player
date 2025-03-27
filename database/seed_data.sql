-- Insert sample users
INSERT INTO users (username, password, is_admin) VALUES
('admin', 'admin123', TRUE),  -- Admin user
('user1', 'user123', FALSE),  -- Regular user
('user2', 'user456', FALSE);  -- Regular user

-- Insert sample music tracks
INSERT INTO music (title, artist, s3_url) VALUES
('Song 1', 'Artist 1', 'https://example.com/song1.mp3'),

-- Insert sample library entries
INSERT INTO library (user_id, music_id) VALUES
(2, 1),  -- User 1 added Song 1 to their library