from app import db
from app.models import RegisteredUser
from app.services.auth.password_hasher import PasswordHasher
from threading import Thread
from flask import jsonify
import uuid
from app.services.database import log_user_login, get_user_by_email
from app.services.auth import session_handler


def get_user_data(user_token):
    """
    Dobavlja korisnikove podatke na osnovu tokena.
    """
    try:
        # Provera validnosti tokena
        session_data = session_handler.get_session(user_token)
        if not session_data:
            return jsonify({"error_code": "UNAUTHORIZED", "message": "Invalid or expired token."}), 401

        # Dohvatanje email-a iz sesije
        email = session_data["email"]

        # Dobavljanje korisnikovih podataka iz baze
        user = get_user_by_email(email)
        if not user:
            return jsonify({"error_code": "USER_NOT_FOUND", "message": "User not found."}), 404

        # Kreiranje odgovora sa korisničkim podacima
        user_data = {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "username": user.username,
            "phone_number": user.phone_number,
            "address": user.address,
            "city": user.city,
            "state": user.state,
            "country": user.country,
            "last_logged_in": user.last_logged_in,
            "is_admin": bool(user.is_admin)
        }
        return jsonify({"user": user_data}), 200

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message": str(e)}), 500


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
        user = get_user_by_email(email)
        if not user:
            return jsonify({"error_code": "EMAIL_NOT_REGISTERED", "message": "Email is not registered."}), 404

        if not PasswordHasher.verify_password(user.password_hash, password):
            return jsonify({"error_code": "INVALID_PASSWORD", "message": "Incorrect password."}), 401

        # Kreiranje sesije
        token = session_handler.create_session(user.id ,email, user.is_admin)
        if isinstance(token, tuple):  # Ako je greška (već ulogovan)
            return token

        # Logovanje korisnika u bazi
        log_user_login(email)

        # Vraćanje tokena i poruke o uspehu
        return jsonify({"message": "Login successful", "token": token}), 200

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message": str(e)}), 500

