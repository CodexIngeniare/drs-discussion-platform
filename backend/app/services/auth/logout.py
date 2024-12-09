from flask import jsonify
from app.services.auth.login import active_sessions

def logout_user(token):
    """
    Handles user logout.
    - Removes the session corresponding to the token.
    """
    if token not in active_sessions:
        return jsonify({"error_code": "INVALID_TOKEN"}), 400

    del active_sessions[token]
    return jsonify({"message": "Logout successful"}), 200
