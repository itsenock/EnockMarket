from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
import bcrypt
import jwt
import datetime

auth_bp = Blueprint('auth_bp', __name__)

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['user_database']

# Helper function to hash passwords
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Helper function to verify passwords
def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

# Helper function to generate JWT token
def generate_token(user_id):
    token = jwt.encode({
        'user_id': str(user_id),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, 'your_jwt_secret_key', algorithm='HS256')
    return token

# Helper function to decode JWT token
def decode_token(token):
    try:
        token = token.split(" ")[1]  # Remove "Bearer " prefix
        payload = jwt.decode(token, 'your_jwt_secret_key', algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.DecodeError:
        return None
    except Exception as e:
        print(f"Error decoding token: {e}")
        return None


# Route to register a new user
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Extract data from request
    first_name = data.get('firstName')
    second_name = data.get('secondName')
    username = data.get('username')
    email = data.get('email')
    phone_number = data.get('phoneNumber')
    location = data.get('location')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')

    # Validate input
    if not all([first_name, second_name, username, email, phone_number, location, password, confirm_password]):
        return jsonify({'error': 'Please fill out all fields.'}), 400

    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match.'}), 400

    # Check if user already exists
    if db.users.find_one({'$or': [{'email': email}, {'username': username}]}):
        return jsonify({'error': 'User with this email or username already exists.'}), 400

    # Hash the password
    hashed_password = hash_password(password)

    # Create user document
    user = {
        'first_name': first_name,
        'second_name': second_name,
        'username': username,
        'email': email,
        'phone_number': phone_number,
        'location': location,
        'password': hashed_password
    }

    # Insert user into the database
    result = db.users.insert_one(user)
    user_id = result.inserted_id

    # Generate JWT token
    token = generate_token(user_id)

    return jsonify({'message': 'Registration successful.', 'token': token}), 201

# Route to login a user
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Extract data from request
    email_or_username = data.get('email')
    password = data.get('password')

    # Validate input
    if not email_or_username or not password:
        return jsonify({'error': 'Please provide email/username and password.'}), 400

    # Find user in the database
    user = db.users.find_one({
        '$or': [
            {'email': email_or_username},
            {'username': email_or_username}
        ]
    })

    if user:
        # Verify password
        if verify_password(password, user['password']):
            # Generate JWT token
            token = generate_token(user['_id'])
            return jsonify({'message': 'Login successful.', 'token': token}), 200
        else:
            return jsonify({'error': 'Invalid credentials.'}), 401
    else:
        return jsonify({'error': 'User not found.'}), 404

# Route to get data for the logged-in user
@auth_bp.route('/me', methods=['GET'])
def get_logged_in_user():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing!'}), 401

    user_id = decode_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token!'}), 401

    user = db.users.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'error': 'User not found!'}), 404

    # Exclude password from the response and convert ObjectId to string
    user_data = {key: value for key, value in user.items() if key != 'password'}
    user_data['_id'] = str(user_data['_id'])
    
    return jsonify(user_data), 200


# Route to get data for all registered users
@auth_bp.route('/users', methods=['GET'])
def get_all_users():
    users = list(db.users.find({}, {'password': 0}))  # Exclude password from the response
    
    # Convert ObjectId to string for JSON serialization
    for user in users:
        user['_id'] = str(user['_id'])
    
    return jsonify(users), 200

# Route to reset password
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()

    email = data.get('email')

    if not email:
        return jsonify({'error': 'Please provide an email.'}), 400

    user = db.users.find_one({'email': email})

    if not user:
        return jsonify({'error': 'User not found.'}), 404

    # Here you would typically send a password reset email to the user
    # Since we cannot send emails, we'll simulate the process

    # Generate a new password or a reset token (this is just a placeholder)
    new_password = 'newPassword123'
    hashed_password = hash_password(new_password)

    # Update the user's password
    db.users.update_one({'_id': user['_id']}, {'$set': {'password': hashed_password}})

    return jsonify({'message': 'Password reset successful. Please check your email for the new password.'}), 200


# Route to update user information
@auth_bp.route('/auth/update', methods=['PUT'])
def update_user_info():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing!'}), 401

    user_id = decode_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token!'}), 401

    data = request.get_json()
    update_fields = {key: value for key, value in data.items() if key in ['first_name', 'second_name', 'username', 'email', 'phone_number', 'location']}
    
    result = db.users.update_one({'_id': ObjectId(user_id)}, {'$set': update_fields})
    if result.modified_count == 0:
        return jsonify({'error': 'Failed to update user information!'}), 400

    updated_user = db.users.find_one({'_id': ObjectId(user_id)})
    updated_user['_id'] = str(updated_user['_id'])
    return jsonify(updated_user), 200