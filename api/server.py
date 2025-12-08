"""
Flask Backend Server for ANVESHA Application

This is the main server file that runs your backend API.
"""

from flask import Flask
from flask_cors import CORS
from auth import auth_bp
from lab import lab_bp

# Create Flask app
app = Flask(__name__)

# Enable CORS for frontend communication
CORS(app, origins=['http://localhost:3000'], supports_credentials=True)

# Register blueprints (API routes)
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(lab_bp, url_prefix='/api')

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return {'status': 'healthy', 'message': 'ANVESHA API is running'}, 200

# Root endpoint
@app.route('/', methods=['GET'])
def root():
    return {
        'message': 'ANVESHA Backend API',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/login, /api/register, /api/verify',
            'lab': '/api/labregistration'
        }
    }, 200


if __name__ == '__main__':
    print("🚀 Starting ANVESHA Backend Server...")
    print("📍 Server running at: http://localhost:5000")
    print("🔗 Frontend should connect to: http://localhost:5000/api")
    print("\n📚 Available endpoints:")
    print("  - POST /api/login")
    print("  - POST /api/register")
    print("  - GET  /api/verify")
    print("  - POST /api/labregistration")
    print("\n✅ Server is ready!\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
