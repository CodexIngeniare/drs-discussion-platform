from flask import Blueprint, request, jsonify
from app.services.auth import session_handler
from app.services.database.likes_queries import like_or_dislike
from app.services.database.discussions_queries import get_discussion_by_id

like_bp = Blueprint('like', __name__)

@like_bp.route('/like_discussion', methods=['POST'])
def like_discussion_route():
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

        # Uzmi status i id diskusije iz JSON tela zahteva
        data = request.get_json()
        status = data.get('status')
        discussion_id = data.get('discussion_id')

        # Provera da li je status validan
        if status not in ["like", "dislike", "neutral"]:
            return jsonify({"error_code": "INVALID_STATUS", "message": "Status must be 'like', 'dislike', or 'neutral'."}),400
        
        # Provera da li diskusija postoji koristeći funkciju get_discussion_by_id
        discussion = get_discussion_by_id(discussion_id)
        if not discussion:
            return jsonify({"error_code": "DISCUSSION_NOT_FOUND", "message": "Discussion not found."}),404

        # Pozivanje funkcije za like/dislike
        result = like_or_dislike(discussion_id, user_id, status)

        # Ako je rezultat rečnik sa porukom, direktno vraćamo tu poruku
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500