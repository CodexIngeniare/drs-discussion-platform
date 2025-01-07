from flask import Blueprint, request, jsonify
from app.services.discussion import create_discussion_service, update_discussion_service, delete_discussion_service
from app.services.auth import session_handler
from app.services.database.discussions_queries import get_all_discussions, search_discussions

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
    

@discussion_bp.route('/delete_discussion', methods=['DELETE'])
def delete_discussion():
    """
    Briše postojeću diskusiju. Proverava prava korisnika (autor ili admin).
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

        if not discussion_id:
            return jsonify({"error_code": "INVALID_DATA", "message": "Missing discussion_id."}), 400

        user_id = session_data.get("user_id")
        is_admin = session_data.get("permissions") == "admin"

        # Pozivanje servisne funkcije
        response, status_code = delete_discussion_service(
            discussion_id=discussion_id,
            user_id=user_id,
            is_admin=is_admin
        )
        return jsonify(response), status_code

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500 
    

@discussion_bp.route('/get_all_discussions', methods=['GET'])
def get_all_discussions_route():
    """
    Vraća sve diskusije u JSON formatu.
    """
    try:

        # Dohvatanje tokena iz Authorization zaglavlja
        user_token = request.headers.get('Authorization')
        if not user_token:
            return jsonify({"error_code": "MISSING_TOKEN", "message": "Token is required."}), 400

        # Obrada "Bearer" prefiksa ako postoji
        if user_token.startswith("Bearer "):
            user_token = user_token[len("Bearer "):]

        # Validacija tokena
        session_data = session_handler.get_session(user_token)
        if not session_data:
            return jsonify({"error_code": "UNAUTHORIZED", "message": "Invalid or expired token."}), 401

        # Dohvatanje user_id iz sesije
        user_id = session_data.get("user_id")

        # Pozivanje servisne funkcije za dobijanje svih diskusija
        discussions = get_all_discussions(user_id=user_id)

        if not discussions:
            return jsonify({"error_code": "SERVER_ERROR", "message": "No discussions found."}), 500

        return jsonify({
            "message": "Discussions retrieved successfully",
            "discussions": discussions
        }), 200


    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500
    

@discussion_bp.route('/search_discussions', methods=['GET'])
def search_discussions_route():
    """
    Pretraga diskusija na osnovu različitih parametara: topic_id, discussion_title, author_username, author_email.
    Uklanja pretragu za prazna polja.
    """
    try:
        # Dohvatanje token-a iz zaglavlja zahteva
        user_token = request.headers.get('Authorization')
        if not user_token:
            return jsonify({"error_code": "MISSING_TOKEN", "message": "Token is required."}), 400

        # Obrada "Bearer" prefiksa ako postoji
        if user_token.startswith("Bearer "):
            user_token = user_token[len("Bearer "):]

        # Validacija tokena
        session_data = session_handler.get_session(user_token)
        if not session_data:
            return jsonify({"error_code": "UNAUTHORIZED", "message": "Invalid or expired token."}), 401
        
        #Dohvatanje user_id iz sesije
        user_id = session_data.get("user_id")

        # Preuzimanje parametara iz upita
        topic_id = request.args.get('topic_id', default=None)
        discussion_title = request.args.get('discussion_title', default=None)
        author_username = request.args.get('author_username', default=None)
        author_email = request.args.get('author_email', default=None)

        # Pozivanje funkcije search_discussions sa filtrima
        discussions = search_discussions(
            user_id = user_id,
            topic_id=topic_id if topic_id != "" else None,
            discussion_title=discussion_title if discussion_title != "" else None,
            author_username=author_username if author_username != "" else None,
            author_email=author_email if author_email != "" else None
        )

        if not discussions:
            return jsonify({"error_code": "NOT_FOUND", "message": "No discussions found."}), 404

        # Uspešan odgovor sa diskusijama
        return jsonify({"discussions": discussions}), 200

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500