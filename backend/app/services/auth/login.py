from app import db
from app.models import RegisteredUser
from app.services.auth.password_hasher import PasswordHasher
from threading import Thread
from flask import jsonify
import uuid
from app.services.database import log_user_login, get_user_by_email
from app.services.auth import session_handler
from app.services.database.user_queries import update_user_data
from app.services.admin import EmailSender
from app.config import Config


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
    - Notifies admin on user's first login
    """
    try:
        # 1. Dohvatanje korisnika iz baze
        user = get_user_by_email(email)
        if not user:
            return jsonify({
                "error_code": "EMAIL_NOT_REGISTERED",
                "message": "Email is not registered."
            }), 404

        # 2. Provera lozinke
        if not PasswordHasher.verify_password(user.password_hash, password):
            return jsonify({
                "error_code": "INVALID_PASSWORD",
                "message": "Incorrect password."
            }), 401

        # 3. Kreiranje sesije
        token = session_handler.create_session(user.id, email, user.is_admin)
        if isinstance(token, tuple):  # Ako već postoji sesija, npr. korisnik je već prijavljen
            return token

        # 4. Logovanje korisnika u sistem
        log_user_login(email)

        # 5. Ako je prva prijava, pošalji adminu email
        if user.first_login:
            try:
                admin_email = Config.ADMIN_EMAIL  # Predefinisani admin email u config fajlu
                email_sender = EmailSender()
                email_sender.send_email(
                    recipient=admin_email,
                    subject="First Login Notification",
                    body=(
                          f"Dear Administrator,\n\n"
                          f"The user {user.first_name} {user.last_name} ({user.email}) has just logged in for the first time.\n\n"
                          f"You may now monitor their activity or perform any necessary administrative actions.\n\n"
        
                          )
                )
                # Ažuriraj status prve prijave
                update_result = update_user_data(email, {"first_login": False})

                if isinstance(update_result, dict) and update_result.get("status") == "error":
                   print(f"Greška prilikom ažuriranja first_login: {update_result['message']}")
                   
            except Exception as e:
                print(f"Greška pri slanju emaila adminu: {str(e)}")
                # Ne blokira login

        # 6. Vraćanje tokena
        return jsonify({
            "message": "Login successful",
            "token": token
        }), 200

    except Exception as e:
        return jsonify({
            "error_code": "SERVER_ERROR",
            "message": str(e)
        }), 500
