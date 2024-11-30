from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_mail import Message
from app.models import db, User, RegistrationRequest
from app.extensions import mail

home_bp = Blueprint('home', __name__)

# Utility functions
def hash_password(password):
    """Hash the password."""
    return generate_password_hash(password)

def verify_password(password, hashed_password):
    """Verify hashed password."""
    return check_password_hash(hashed_password, password)

def send_email(recipient, subject, body):
    """Helper function to send emails."""
    msg = Message(subject, recipients=[recipient], body=body)
    mail.send(msg)

# Registration endpoint
@home_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.json

    # Validate unique email and username
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already in use"}), 400
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already in use"}), 400

    # Create new user
    user = User(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        username=data['username'],
        password=hash_password(data['password']),
        phone_number=data['phone_number'],
        address=data['address'],
        city=data['city'],
        country=data['country'],
    )
    db.session.add(user)
    db.session.commit()

    # Create registration request
    reg_request = RegistrationRequest(user_id=user.id)
    db.session.add(reg_request)
    db.session.commit()

    return jsonify({"message": "Registration request submitted"}), 201

# Login endpoint with token generation
@home_bp.route('/login', methods=['POST'])
def login():
    """Authenticate user and generate token."""
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and verify_password(data['password'], user.password):
        if not user.is_active:
            return jsonify({"message": "Account not activated. Please wait for approval."}), 403
        
        # Generate token with role and session info
        token = create_access_token(identity={"user_id": user.id, "role": user.role})
        return jsonify({"message": "Login successful", "token": token}), 200

    return jsonify({"message": "Invalid credentials"}), 401

# Get all registration requests (Admin only)
@home_bp.route('/admin/registration_requests', methods=['GET'])
@jwt_required()
def get_registration_requests():
    """Get all pending registration requests (Admin only)."""
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"message": "Unauthorized access"}), 403

    requests = RegistrationRequest.query.filter_by(status='pending').all()
    data = [
        {
            "id": req.id,
            "user_id": req.user_id,
            "user_info": {
                "first_name": req.user.first_name,
                "last_name": req.user.last_name,
                "email": req.user.email,
                "username": req.user.username,
            },
        }
        for req in requests
    ]
    return jsonify(data), 200

# Approve registration request (Admin only)
@home_bp.route('/admin/approve_request/<int:request_id>', methods=['POST'])
@jwt_required()
def approve_request(request_id):
    """Approve a pending registration request."""
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"message": "Unauthorized access"}), 403

    reg_request = RegistrationRequest.query.get(request_id)
    if reg_request:
        reg_request.status = 'approved'
        user = User.query.get(reg_request.user_id)
        user.is_active = True
        db.session.commit()
        send_email(user.email, "Account Approved", "Your account has been activated.")
        return jsonify({"message": "Request approved"}), 200
    return jsonify({"message": "Request not found"}), 404

# Reject registration request (Admin only)
@home_bp.route('/admin/reject_request/<int:request_id>', methods=['POST'])
@jwt_required()
def reject_request(request_id):
    """Reject a pending registration request."""
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"message": "Unauthorized access"}), 403

    reg_request = RegistrationRequest.query.get(request_id)
    if reg_request:
        reg_request.status = 'rejected'
        db.session.commit()
        user = User.query.get(reg_request.user_id)
        send_email(user.email, "Account Rejected", "Your registration has been rejected.")
        return jsonify({"message": "Request rejected"}), 200
    return jsonify({"message": "Request not found"}), 404

# Get all users (Admin only)
@home_bp.route('/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    """Get all users (Admin only)."""
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"message": "Unauthorized access"}), 403

    users = User.query.all()
    data = [
        {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "username": user.username,
            "role": user.role,
            "is_active": user.is_active,
        }
        for user in users
    ]
    return jsonify(data), 200

# Update user profile
@home_bp.route('/update_profile/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_profile(user_id):
    """Update user profile."""
    current_user = get_jwt_identity()
    if current_user['user_id'] != user_id and current_user['role'] != 'admin':
        return jsonify({"message": "Unauthorized access"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.email = data.get('email', user.email)
    user.username = data.get('username', user.username)
    user.phone_number = data.get('phone_number', user.phone_number)
    user.address = data.get('address', user.address)
    user.city = data.get('city', user.city)
    user.country = data.get('country', user.country)
    if data.get('password'):
        user.password = hash_password(data['password'])
    db.session.commit()

    return jsonify({"message": "Profile updated successfully"}), 200
