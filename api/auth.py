"""
Authentication API Endpoints

This module handles user authentication including login, registration, and token management.
"""

from flask import Blueprint, request, jsonify
import jwt
import datetime
from functools import wraps

auth_bp = Blueprint('auth', __name__)

# Secret key for JWT (use environment variable in production)
SECRET_KEY = 'your-secret-key-here'

# Mock user database (replace with real database)
USERS = [
    {
        'id': 'admin-001',
        'name': 'System Administrator',
        'email': 'admin@ayush.gov.in',
        'password': 'admin123',  # In production, use hashed passwords
        'role': 'Admin',
        'status': 'APPROVED'
    },
    {
        'id': 'lab-001',
        'name': 'Dr. Rajesh Kumar',
        'email': 'lab@ayush.gov.in',
        'password': 'lab123',
        'role': 'Lab QA',
        'status': 'APPROVED'
    },
    {
        'id': 'processor-001',
        'name': 'Amit Sharma',
        'email': 'processor@ayush.gov.in',
        'password': 'processor123',
        'role': 'Processor',
        'status': 'APPROVED'
    },
    {
        'id': 'manufacturer-001',
        'name': 'Priya Patel',
        'email': 'manufacturer@ayush.gov.in',
        'password': 'manufacturer123',
        'role': 'Manufacturer',
        'status': 'APPROVED'
    }
]


def token_required(f):
    """Decorator to protect routes that require authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = next((u for u in USERS if u['id'] == data['user_id']), None)
            
            if not current_user:
                return jsonify({'message': 'Invalid token'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login endpoint
    
    Request body:
    {
        "email": "user@example.com",
        "password": "password123"
    }
    
    Response:
    {
        "token": "jwt-token-here",
        "user": {
            "id": "user-id",
            "name": "User Name",
            "email": "user@example.com",
            "role": "Admin",
            "status": "APPROVED"
        }
    }
    """
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400
    
    email = data['email'].lower()
    password = data['password']
    
    # Find user
    user = next((u for u in USERS if u['email'].lower() == email), None)
    
    if not user:
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Verify password (in production, use password hashing)
    if user['password'] != password:
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Check user status
    if user['status'] == 'PENDING':
        return jsonify({'message': 'Account is pending approval'}), 403
    
    if user['status'] == 'REJECTED':
        return jsonify({'message': 'Account has been rejected'}), 403
    
    # Generate JWT token
    token = jwt.encode({
        'user_id': user['id'],
        'email': user['email'],
        'role': user['role'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, SECRET_KEY, algorithm='HS256')
    
    # Return user data without password
    user_data = {k: v for k, v in user.items() if k != 'password'}
    
    return jsonify({
        'token': token,
        'user': user_data
    }), 200


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Registration endpoint
    
    Request body:
    {
        "name": "User Name",
        "email": "user@example.com",
        "password": "password123",
        "role": "Processor"
    }
    """
    data = request.get_json()
    
    required_fields = ['name', 'email', 'password', 'role']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'All fields are required'}), 400
    
    # Check if user already exists
    if any(u['email'].lower() == data['email'].lower() for u in USERS):
        return jsonify({'message': 'Email already registered'}), 409
    
    # Create new user (in production, hash password and save to database)
    new_user = {
        'id': f"user-{len(USERS) + 1:03d}",
        'name': data['name'],
        'email': data['email'],
        'password': data['password'],  # Hash this in production!
        'role': data['role'],
        'status': 'PENDING'  # Requires admin approval
    }
    
    USERS.append(new_user)
    
    return jsonify({
        'message': 'Registration successful. Awaiting admin approval.',
        'user_id': new_user['id']
    }), 201


@auth_bp.route('/verify', methods=['GET'])
@token_required
def verify_token(current_user):
    """
    Verify if token is valid
    
    Headers:
    Authorization: Bearer <token>
    
    Response:
    {
        "valid": true,
        "user": { ... }
    }
    """
    user_data = {k: v for k, v in current_user.items() if k != 'password'}
    
    return jsonify({
        'valid': True,
        'user': user_data
    }), 200


@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout(current_user):
    """
    Logout endpoint (client-side should clear token)
    """
    return jsonify({'message': 'Logged out successfully'}), 200
