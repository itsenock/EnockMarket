from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from pymongo import MongoClient
import jwt
from werkzeug.utils import secure_filename
import os

item_bp = Blueprint('item_bp', __name__)

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['user_database']


# Define the upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    
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
    
# Route to serve uploaded images
@item_bp.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# Route to save a new item
@item_bp.route('/user/item', methods=['POST'])
def save_item():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing!'}), 401

    user_id = decode_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token!'}), 401

    data = request.form.to_dict()
    images = request.files.getlist('images')

    image_paths = []
    for image in images:
        filename = secure_filename(image.filename)
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        image.save(image_path)
        image_paths.append(f'/uploads/{filename}')

    item = {
        'user_id': ObjectId(user_id),
        'name': data['name'],
        'category': data['category'],
        'condition': data['condition'],
        'description': data['description'],
        'price': data['price'],
        'warranty': data.get('warranty'),
        'images': image_paths,
        'quantity': data['quantity']
    }

    result = db.items.insert_one(item)
    item['_id'] = str(result.inserted_id)
    item['user_id'] = str(item['user_id'])
    
    return jsonify(item), 201

# Route to get user items
@item_bp.route('/user/items', methods=['GET'])
def get_user_items():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing!'}), 401

    user_id = decode_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token!'}), 401

    items = list(db.items.find({'user_id': ObjectId(user_id)}))
    
    for item in items:
        item['_id'] = str(item['_id'])
        item['user_id'] = str(item['user_id'])
    
    return jsonify(items), 200


# Route to delete a user item
@item_bp.route('/user/item/<item_id>', methods=['DELETE'])
def delete_user_item(item_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing!'}), 401

    user_id = decode_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token!'}), 401

    result = db.items.delete_one({'_id': ObjectId(item_id), 'user_id': ObjectId(user_id)})
    if result.deleted_count == 0:
        return jsonify({'error': 'Item not found or not authorized to delete this item.'}), 404

    return jsonify({'message': 'Item deleted successfully.'}), 200


# Route to get all products
@item_bp.route('/products', methods=['GET'])
def get_products():
    items = list(db.items.find({}))

    for item in items:
        item['_id'] = str(item['_id'])
        item['user_id'] = str(item['user_id'])

    return jsonify(items), 200

# Route to get a single product by ID
@item_bp.route('/product/<item_id>', methods=['GET'])
def get_product(item_id):
    item = db.items.find_one({'_id': ObjectId(item_id)})
    if not item:
        return jsonify({'error': 'Product not found!'}), 404

    item['_id'] = str(item['_id'])
    item['user_id'] = str(item['user_id'])

    return jsonify(item), 200

