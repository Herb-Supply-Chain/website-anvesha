"""
Lab Registration API Endpoint

Handles lab registration submissions from the admin panel.
"""

from flask import Blueprint, request, jsonify
from datetime import datetime

lab_bp = Blueprint('lab', __name__)

# Mock database for lab registrations
LAB_REGISTRATIONS = []


@lab_bp.route('/labregistration', methods=['POST'])
def register_lab():
    """
    Lab registration endpoint
    
    Request body:
    {
        "labName": "ABC Testing Laboratory",
        "contactPerson": "Dr. John Doe",
        "email": "contact@abclab.com",
        "phone": "+91 98765 43210",
        "nablNumber": "NABL-123456",
        "submittedAt": "2024-12-08T11:42:55.123Z"
    }
    
    Response:
    {
        "success": true,
        "message": "Lab registration received successfully",
        "registrationId": "LAB-2024-001"
    }
    """
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['labName', 'contactPerson', 'email', 'phone', 'nablNumber']
    missing_fields = [field for field in required_fields if field not in data]
    
    if missing_fields:
        return jsonify({
            'success': False,
            'message': f'Missing required fields: {", ".join(missing_fields)}'
        }), 400
    
    # Check if email already exists
    if any(lab['email'] == data['email'] for lab in LAB_REGISTRATIONS):
        return jsonify({
            'success': False,
            'message': 'Email already registered'
        }), 409
    
    # Generate registration ID
    registration_id = f"LAB-{datetime.now().year}-{len(LAB_REGISTRATIONS) + 1:03d}"
    
    # Create registration record
    registration = {
        'id': registration_id,
        'labName': data['labName'],
        'contactPerson': data['contactPerson'],
        'email': data['email'],
        'phone': data['phone'],
        'nablNumber': data['nablNumber'],
        'status': 'PENDING',
        'submittedAt': data.get('submittedAt', datetime.utcnow().isoformat()),
        'createdAt': datetime.utcnow().isoformat()
    }
    
    # Save to database (in production, use real database)
    LAB_REGISTRATIONS.append(registration)
    
    return jsonify({
        'success': True,
        'message': 'Lab registration received successfully',
        'registrationId': registration_id,
        'data': registration
    }), 201


@lab_bp.route('/labregistration/<registration_id>', methods=['GET'])
def get_lab_registration(registration_id):
    """
    Get lab registration by ID
    """
    registration = next((lab for lab in LAB_REGISTRATIONS if lab['id'] == registration_id), None)
    
    if not registration:
        return jsonify({
            'success': False,
            'message': 'Registration not found'
        }), 404
    
    return jsonify({
        'success': True,
        'data': registration
    }), 200


@lab_bp.route('/labregistration', methods=['GET'])
def get_all_lab_registrations():
    """
    Get all lab registrations
    
    Query parameters:
    - status: Filter by status (PENDING, APPROVED, REJECTED)
    """
    status = request.args.get('status')
    
    registrations = LAB_REGISTRATIONS
    
    if status:
        registrations = [lab for lab in registrations if lab['status'] == status.upper()]
    
    return jsonify({
        'success': True,
        'count': len(registrations),
        'data': registrations
    }), 200


@lab_bp.route('/labregistration/<registration_id>/status', methods=['PUT'])
def update_lab_status(registration_id):
    """
    Update lab registration status
    
    Request body:
    {
        "status": "APPROVED" | "REJECTED"
    }
    """
    data = request.get_json()
    
    if 'status' not in data:
        return jsonify({
            'success': False,
            'message': 'Status is required'
        }), 400
    
    registration = next((lab for lab in LAB_REGISTRATIONS if lab['id'] == registration_id), None)
    
    if not registration:
        return jsonify({
            'success': False,
            'message': 'Registration not found'
        }), 404
    
    registration['status'] = data['status']
    registration['updatedAt'] = datetime.utcnow().isoformat()
    
    return jsonify({
        'success': True,
        'message': f'Registration status updated to {data["status"]}',
        'data': registration
    }), 200
