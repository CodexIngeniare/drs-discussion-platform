from app import db
from app.models import RegisteredUser
from werkzeug.security import check_password_hash
from threading import Thread
from flask import jsonify
import uuid

# Dictionary to manage sessions
active_sessions = {}

def notify_admin(user):
    """
    Notify admin about the first-time login via email.
    (Simulated notification.)
    """
    print(f"Admin notified about first-time login for {user.email}")

def login_user(email, password):
    """
    Handles user login.
    - Checks user existence
    - Validates password
    - Creates session token
    - Notifies admin for the first login
    """
    try:
        user = RegisteredUser.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error_code": "EMAIL_NOT_REGISTERED", "message": "Email is not registered."}), 400

        if not check_password_hash(user.password_hash, password):
            return jsonify({"error_code": "INVALID_PASSWORD", "message": "Incorrect password."}), 400

        # Create token and store session
        token = str(uuid.uuid4())
        active_sessions[token] = {
            "email": user.email,
            "permissions": "admin" if user.is_admin else "user"
        }

        # Notify admin if first login
        if not user.last_logged_in:
            thread = Thread(target=notify_admin, args=(user,))
            thread.start()

        # Update last login
        user.last_logged_in = db.func.current_timestamp()
        db.session.commit()

        return jsonify({"token": token}), 200

    except Exception as e:
        # Обрада грешака унутар функције
        return jsonify({"error_code": "SERVER_ERROR", "message": str(e)}), 500
