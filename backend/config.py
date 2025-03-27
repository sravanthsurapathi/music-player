import os

# Database Configuration
DATABASE_URL = "postgresql://postgres:Pass1243@musicplayer.c706msiosjrq.us-east-1.rds.amazonaws.com:5432/music_db"

# JWT Secret Key
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")

# Flask Configuration
DEBUG = os.getenv("DEBUG", "True") == "True"  # Enable/disable debug mode