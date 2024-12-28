from flask import Blueprint, request, jsonify
from app.services.discussion import create_discussion_service, update_discussion_service
from app.services.auth import session_handler

discussion_bp = Blueprint('discussion', __name__)

@discussion_bp.route('/create_discussion', methods=['POST'])
def create_discussion():
    """
    Kreira novu diskusiju. Proverava da li je korisnik autentifikovan.
    """
    try:
        # Preuzimanje tokena iz Authorization zaglavlja
        user_token = request.headers.get('Authorization')
        if not user_token:
            return jsonify({"error_code": "MISSING_TOKEN", "message": "Token is required."}), 400

        # Validacija tokena
        if user_token.startswith("Bearer "):
            user_token = user_token[len("Bearer "):]

        # Dohvatanje sesije sa tokena
        session_data = session_handler.get_session(user_token)
        if not session_data:
            return jsonify({"error_code": "UNAUTHORIZED", "message": "Invalid or expired token."}), 401

        # Parsiranje podataka iz tela zahteva
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        topic_id = data.get('topic_id')

        if not title or not content or not topic_id:
            return jsonify({"error_code": "INVALID_DATA", "message": "Missing required fields."}), 400

        user_id = session_data.get("user_id")  # Preuzimanje user_id iz sesije

        # Pozivanje servisne funkcije za kreiranje diskusije
        new_discussion = create_discussion_service(title, content, user_id, topic_id)

        if not new_discussion:
            return jsonify({"error_code": "SERVER_ERROR", "message": "Failed to create discussion."}), 500

        # Uspešan odgovor sa detaljima o novoj diskusiji
        return jsonify({
            "message": "Discussion created successfully",
            "discussion": {
                "id": new_discussion.id,
                "title": new_discussion.title,
                "content": new_discussion.content,
                "topic_id": new_discussion.topic_id,
                "user_id": new_discussion.user_id,
                "created_at": new_discussion.created_at,
                "updated_at": new_discussion.updated_at
            }
        }), 201

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500
    

@discussion_bp.route('/update_discussion', methods=['PUT'])
def update_discussion():
    """
    Ažurira postojeću diskusiju. Proverava prava korisnika (autor ili admin).
    """
    try:
        # Preuzimanje tokena iz Authorization zaglavlja
        user_token = request.headers.get('Authorization')
        if not user_token:
            return jsonify({"error_code": "MISSING_TOKEN", "message": "Token is required."}), 400

        # Validacija tokena
        if user_token.startswith("Bearer "):
            user_token = user_token[len("Bearer "):]

        session_data = session_handler.get_session(user_token)
        if not session_data:
            return jsonify({"error_code": "UNAUTHORIZED", "message": "Invalid or expired token."}), 401

        # Parsiranje podataka iz zahteva
        data = request.get_json()
        discussion_id = data.get('discussion_id')
        title = data.get('title')
        content = data.get('content')
        topic_id = data.get('topic_id')

        if not discussion_id:
            return jsonify({"error_code": "INVALID_DATA", "message": "Missing discussion_id."}), 400

        user_id = session_data.get("user_id")
        is_admin = session_data.get("permissions") == "admin"

        # Pozivanje servisne funkcije
        response, status_code = update_discussion_service(
            discussion_id=discussion_id,
            user_id=user_id,
            is_admin=is_admin,
            title=title,
            content=content,
            topic_id=topic_id
        )
        return jsonify(response), status_code

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500