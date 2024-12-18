from flask import jsonify
from app.services.auth.SessionHandler import SessionHandler
from app.services.auth import session_handler


def logout_user(token):
    """
    Handles user logout.
    - Removes the session corresponding to the token.
    """
    try:
        if session_handler.logout(token):  # Ispravljen poziv
            return jsonify({"message": "Successfully logged out."}), 200
        else:
            return jsonify({"error_code": "INVALID_TOKEN", "message": "Token not found or already invalidated."}), 404
    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message": str(e)}), 500

