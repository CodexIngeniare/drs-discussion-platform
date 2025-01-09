from flask import Blueprint, request, jsonify
from app.services.comment import create_comment_service, delete_comment_service
from app.services.database.comments_queries import get_comments_by_discussion_id
from app.services.auth import session_handler


comment_bp = Blueprint('comment', __name__)

@comment_bp.route('/create_comment', methods=['POST'])
def create_comment():
    """
    Kreira novi komentar. Proverava da li je korisnik autentifikovan.
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
        discussion_id = data.get('discussion_id')
        content = data.get('content')

        if not discussion_id or not content:
            return jsonify({"error_code": "INVALID_DATA", "message": "Missing required fields."}), 400

        user_id = session_data.get("user_id")  # Preuzimanje user_id iz sesije

        # Pozivanje servisne funkcije za kreiranje komentara
        new_comment = create_comment_service(discussion_id, user_id, content)

        if not new_comment:
            return jsonify({"error_code": "SERVER_ERROR", "message": "Failed to create comment."}), 500

        # Uspešan odgovor sa detaljima o novom komentaru
        return jsonify({
            "message": "Comment created successfully",
            "comment": {
                "id": new_comment.id,
                "discussion_id": new_comment.discussion_id,
                "user_id": new_comment.user_id,
                "content": new_comment.content,
                "created_at": new_comment.created_at.isoformat()
            }
        }), 201

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500
    


@comment_bp.route('/delete_comment', methods=['DELETE'])
def delete_comment():
    """
    Briše komentar. Dozvoljeno samo korisnicima koji su admini, autori komentara ili autori diskusije.
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

        # Parsiranje podataka iz tela zahteva
        data = request.get_json()
        comment_id = data.get('comment_id')

        if not comment_id:
            return jsonify({"error_code": "INVALID_DATA", "message": "Missing comment_id."}), 400

        user_id = session_data.get("user_id")
        is_admin = session_data.get("permissions") == "admin"

        # Pozivanje servisne funkcije
        response, status_code = delete_comment_service(comment_id=comment_id, user_id=user_id, is_admin=is_admin)
        return jsonify(response), status_code

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500
    

@comment_bp.route('/get_discussion_comments', methods=['GET'])
def get_discussion_comments():
    """
    Vraća listu svih komentara za određenu diskusiju.
    """
    try:
     
        #data = request.get_json()
        #discussion_id = data.get('discussion_id')
        discussion_id = request.args.get('discussion_id')

        if not discussion_id:
            return jsonify({"error_code": "BAD_REQUEST", "message": "Discussion ID is required."}),400
       
        comments = get_comments_by_discussion_id(discussion_id)
        if comments is None:
            return jsonify({"error_code": "SERVER_ERROR", "message": "Failed to fetch comments."}), 500
        if not comments:
            return jsonify({"message": "No comments found for the given discussion."}), 404
        return jsonify({"comments": comments}), 200
    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500