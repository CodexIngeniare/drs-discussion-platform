from flask import Blueprint, request, jsonify
from app.services.database.user_queries import approve_user
from app.services.admin import EmailSender
from app.services.auth import session_handler

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