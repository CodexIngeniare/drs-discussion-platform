from flask import Blueprint, request, jsonify
from app.services.database.user_queries import approve_user, remove_pending_user, get_all_pending_users, get_all_registered_users
from app.services.admin import EmailSender
from app.services.auth import session_handler
from app.services.admin.extensions import socketio  
from flask_socketio import emit, disconnect
import json


# Definicija Blueprint-a za admin rute
admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/approve_user', methods=['POST'])
def approve_user_route():
    """
    Odobrava korisnika sa prosleđenim user_id i šalje email obaveštenje.
    Proverava da li je korisnik koji je poslao zahtev admin.
    """
    try:
        # Dohvati token iz zaglavlja zahteva
        user_token = request.headers.get('Authorization')
        if not user_token:
            return jsonify({"error_code": "MISSING_TOKEN", "message": "Token is required."}), 400

        # Validacija tokena
        if user_token.startswith("Bearer "):
           user_token = user_token[len("Bearer "):]

        session_data = session_handler.get_session(user_token)
        if not session_data:
            return jsonify({"error_code": "UNAUTHORIZED", "message": "Invalid or expired token."}), 401

        # Provera administratorskih privilegija
        email = session_data.get("email")
        permissions = session_data.get("permissions")
        if not email or permissions != "admin":
            return jsonify({"error_code": "FORBIDDEN", "message": "Admin privileges required."}), 403

        # Parsiranje ulaznih podataka
        data = request.get_json()
        if not data or "user_id" not in data:
            return jsonify({"error_code": "INVALID_DATA", "message": "User ID is required."}), 400

        user_id = data["user_id"]

        # Poziv logike za odobravanje korisnika
        new_user = approve_user(user_id)
        if not new_user:
            return jsonify({"error_code": "NOT_FOUND", "message": "User not found or approval failed."}), 404

        # Slanje email obaveštenja
        try:
            email_sender = EmailSender()
            email_sender.send_email(
                recipient=new_user.email,
                subject= "Registration Approved",
                body=f"Dear {new_user.first_name},\n\n Your registration request has been approved. You can now log in to your account."
            )
        except Exception as e:
            return jsonify({"error": f"User approved but failed to send email: {str(e)}"}), 500

        # Uspešan odgovor
        return jsonify({
            "message": "User approved successfully",
            "user": {
                "id": new_user.id,
                "email": new_user.email,
                "username": new_user.username
            }
        }), 200

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500



@admin_bp.route('/disapprove_user', methods=['POST'])
def disapprove_user_route():
    """
    Odbija korisnika sa prosleđenim user_id i šalje email obaveštenje.
    Proverava da li je korisnik koji je poslao zahtev admin.
    """
    try:
        # Dohvati token iz zaglavlja zahteva
        user_token = request.headers.get('Authorization')
        if not user_token:
            return jsonify({"error_code": "MISSING_TOKEN", "message": "Token is required."}), 400

        # Validacija tokena
        if user_token.startswith("Bearer "):
            user_token = user_token[len("Bearer "):]

        session_data = session_handler.get_session(user_token)
        if not session_data:
            return jsonify({"error_code": "UNAUTHORIZED", "message": "Invalid or expired token."}), 401

        # Provera administratorskih privilegija
        email = session_data.get("email")
        permissions = session_data.get("permissions")
        if not email or permissions != "admin":
            return jsonify({"error_code": "FORBIDDEN", "message": "Admin privileges required."}), 403

        # Parsiranje ulaznih podataka
        data = request.get_json()
        if not data or "user_id" not in data:
            return jsonify({"error_code": "INVALID_DATA", "message": "User ID is required."}), 400

        user_id = data["user_id"]

        # Uklanjanje korisnika iz PendingUsers
        removed_user = remove_pending_user(user_id)
        if not removed_user:
            return jsonify({"error_code": "NOT_FOUND", "message": "User not found or disapproval failed."}), 404

        # Slanje email obaveštenja
        try:
            email_sender = EmailSender()
            email_sender.send_email(
                recipient=removed_user.email,
                subject="Registration Disapproved",
                body=f"Dear {removed_user.first_name},\n\nWe regret to inform you that your registration request has been disapproved."
            )
        except Exception as e:
            return jsonify({"error": f"User disapproved but failed to send email: {str(e)}"}), 500

        # Uspešan odgovor
        return jsonify({
            "message": "User disapproved successfully",
            "user": {
                "id": removed_user.id,
                "email": removed_user.email,
                "username": removed_user.username
            }
        }), 200

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500
    




@socketio.on('connect', namespace='/admin')
def handle_admin_connect():
    try:
        
        # Dohvati token iz query parametra ili zaglavlja
        user_token = request.args.get('token') or request.headers.get('Authorization')
        if not user_token:
            emit('error', {"error_code": 400, "message": "Token is required."})  # MISSING_TOKEN
            disconnect()
            return

        # Obradi "Bearer" prefiks ako postoji
        if user_token.startswith("Bearer "):
            user_token = user_token[len("Bearer "):]
         
        # Validiraj token i proveri administratorske privilegije
        session_data = session_handler.get_session(user_token)

        if not session_data:
            emit('error', {"error_code": 401, "message": "Invalid or expired token."})  # UNAUTHORIZED
            disconnect()
            return

        email = session_data.get("email")
        permissions = session_data.get("permissions")
        if not email or permissions != "admin":
            emit('error', {"error_code": 403, "message": "Admin privileges required."})  # FORBIDDEN
            disconnect()
            return

        # Ako je admin validan, šaljemo listu pending korisnika
        pending_users_data = get_all_pending_users()
        emit('pending_users', pending_users_data)
        

    except Exception as e:
        emit('error', {"error_code": 500, "message": f"Server error: {str(e)}"})  # SERVER_ERROR
        disconnect()


@socketio.on_error_default
def default_error_handler(e):
    print(f"SocketIO greška:{e}")


@admin_bp.route('/registered_users', methods=['GET'])
def get_registered_users():
    """
    Vraća listu svih registrovanih korisnika.
    Proverava da li je zahtev poslao admin.
    """
    try:
        # Dohvati token iz zaglavlja zahteva
        user_token = request.headers.get('Authorization')
        if not user_token:
            return jsonify({"error_code": "MISSING_TOKEN", "message": "Token is required."}), 400

        # Validacija tokena
        if user_token.startswith("Bearer "):
            user_token = user_token[len("Bearer "):]

        session_data = session_handler.get_session(user_token)
        if not session_data:
            return jsonify({"error_code": "UNAUTHORIZED", "message": "Invalid or expired token."}), 401

        # Provera administratorskih privilegija
        email = session_data.get("email")
        permissions = session_data.get("permissions")
        if not email or permissions != "admin":
            return jsonify({"error_code": "FORBIDDEN", "message": "Admin privileges required."}), 403

        # Dohvatanje svih registrovanih korisnika
        registered_users = get_all_registered_users()
        if registered_users is None:
            return jsonify({"error_code": "SERVER_ERROR", "message": "Failed to fetch registered users."}), 500

        # Formatiranje rezultata
        result = [
            {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "phone_number": user.phone_number,
                "country": user.country,
                "city": user.city,
                "address": user.address
            }
            for user in registered_users
        ]

        return jsonify({"registered_users": result}), 200

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500