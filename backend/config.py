import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your_flask_secret_key')
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/user_database')  # MongoDB URI
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your_jwt_secret_key')
