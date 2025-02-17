from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from pymongo import MongoClient
import jwt

cart_bp = Blueprint('cart_bp', __name__)

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['user_database']

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

# Route to get cart items for the logged-in user
@cart_bp.route('/user/cart', methods=['GET'])
def get_user_cart():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing!'}), 401

    user_id = decode_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token!'}), 401

    cart_items = list(db.cart.find({'user_id': ObjectId(user_id)}))
    for item in cart_items:
        item['_id'] = str(item['_id'])
        item['user_id'] = str(item['user_id'])
        item['product_id'] = str(item['product_id'])
    return jsonify(cart_items), 200

# Route to add an item to the user's cart
@cart_bp.route('/user/cart', methods=['POST'])
def add_to_cart():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing!'}), 401

    user_id = decode_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token!'}), 401

    data = request.get_json()
    cart_item = {
        'user_id': ObjectId(user_id),
        'product_id': ObjectId(data['product_id']),
        'name': data['name'],
        'price': data['price'],
        'quantity': data['quantity'],
        'images': data['images']
    }

    db.cart.insert_one(cart_item)
    cart_item['_id'] = str(cart_item['_id'])
    cart_item['user_id'] = str(cart_item['user_id'])
    cart_item['product_id'] = str(cart_item['product_id'])

    return jsonify(cart_item), 201

# Route to remove an item from the user's cart
@cart_bp.route('/user/cart/<item_id>', methods=['DELETE'])
def remove_from_cart(item_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing!'}), 401

    user_id = decode_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token!'}), 401

    db.cart.delete_one({'_id': ObjectId(item_id), 'user_id': ObjectId(user_id)})
    return jsonify({'message': 'Item removed from cart'}), 200

# Route to get wishlist items for the logged-in user
@cart_bp.route('/user/wishlist', methods=['GET'])
def get_user_wishlist():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing!'}), 401

    user_id = decode_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token!'}), 401

    wishlist_items = list(db.wishlist.find({'user_id': ObjectId(user_id)}))
    for item in wishlist_items:
        item['_id'] = str(item['_id'])
        item['user_id'] = str(item['user_id'])
        item['product_id'] = str(item['product_id'])
    return jsonify(wishlist_items), 200

# Route to add an item to the user's wishlist
@cart_bp.route('/user/wishlist', methods=['POST'])
def add_to_wishlist():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing!'}), 401

    user_id = decode_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token!'}), 401

    data = request.get_json()
    wishlist_item = {
        'user_id': ObjectId(user_id),
        'product_id': ObjectId(data['product_id']),
        'name': data['name'],
        'price': data['price'],
        'images': data['images']
    }

    db.wishlist.insert_one(wishlist_item)
    wishlist_item['_id'] = str(wishlist_item['_id'])
    wishlist_item['user_id'] = str(wishlist_item['user_id'])
    wishlist_item['product_id'] = str(wishlist_item['product_id'])

    return jsonify(wishlist_item), 201

# Route to remove an item from the user's wishlist
@cart_bp.route('/user/wishlist/<item_id>', methods=['DELETE'])
def remove_from_wishlist(item_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing!'}), 401

    user_id = decode_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token!'}), 401

    db.wishlist.delete_one({'_id': ObjectId(item_id), 'user_id': ObjectId(user_id)})
    return jsonify({'message': 'Item removed from wishlist'}), 200
