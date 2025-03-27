from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import DATABASE_URL, DEBUG
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

CORS(app, supports_credentials=True)

# Configure the app
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["DEBUG"] = DEBUG

# Initialize the database
db = SQLAlchemy(app)

# Import and register routes
from .routes.user_routes import user_routes
from .routes.admin_routes import admin_routes
from .routes.library_routes import library_routes

app.register_blueprint(user_routes, url_prefix='/api/user')
app.register_blueprint(admin_routes, url_prefix='/api/admin')
app.register_blueprint(library_routes, url_prefix='/api')

# Import models (to ensure they are registered with SQLAlchemy)
from .models.user_model import User
from .models.music_model import Music
from .models.library_model import Library

@app.cli.command("init-db")
def init_db():
    """Initialize the database."""
    with app.app_context():
        print("Creating tables...")
        db.create_all()
        print("Tables created.")
