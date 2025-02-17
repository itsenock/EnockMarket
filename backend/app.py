from flask import Flask, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from routes.auth_routes import auth_bp
from routes.item_routes import item_bp
from routes.cart_routes import cart_bp

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config.from_object('config.Config')

# Enable CORS for all routes and origins
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# MongoDB setup
client = MongoClient(app.config['MONGO_URI'])
db = client['user_database']

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(item_bp, url_prefix='/api')
app.register_blueprint(cart_bp, url_prefix='/api')

# Serve static files from the uploads directory
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
