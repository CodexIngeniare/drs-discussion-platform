from flask import Blueprint, request, jsonify
from app.services.auth import session_handler
from app.services.admin import EmailSender
from app.services.database.user_queries import get_user_by_email, get_user_by_username
from app.services.database.discussions_queries import get_discussion_by_id
from app.services.database.comments_queries import get_comment_by_id

tag_bp = Blueprint('tag_bp', __name__)

@tag_bp.route('/tag_user', methods=['POST'])
def tag_user():
    """
    Taguje korisnika u diskusiji ili komentaru, i šalje mu obaveštenje putem e-maila.
    """
    try:
        # Dohvatanje tokena iz zaglavlja zahteva
        user_token = request.headers.get('Authorization')
        if not user_token:
            return jsonify({"error_code": "MISSING_TOKEN", "message": "Token is required."}), 400

        # Obrada "Bearer" prefiksa ako postoji
        if user_token.startswith("Bearer "):
            user_token = user_token[len("Bearer "):]

        # Validacija tokena i dobijanje sesije
        session_data = session_handler.get_session(user_token)
        if not session_data:
            return jsonify({"error_code": "UNAUTHORIZED", "message": "Invalid or expired token."}), 401

        # Dohvatanje email-a iz sesije
        email = session_data.get("email")
        if not email:
            return jsonify({"error_code": "MISSING_EMAIL", "message": "User email is required."}), 400

        # Pretraga korisnika prema email-u
        user = get_user_by_email(email)
        if not user:
            return jsonify({"error_code": "USER_NOT_FOUND", "message": "User not found."}), 404

        # Preuzimanje podataka iz zahteva
        data = request.get_json()
        if not data or not all(key in data for key in ['tagged_username', 'discussion_id']):
            return jsonify({"error_code": "INVALID_DATA", "message": "Tagged username and discussion ID are required."}), 400

        tagged_username = data['tagged_username']
        discussion_id = data['discussion_id']
        comment_id = data.get('comment_id', "")

        # Pretraga tagovanog korisnika prema korisničkom imenu
        tagged_user = get_user_by_username(tagged_username)
        if not tagged_user:
            return jsonify({"error_code": "USER_NOT_FOUND", "message": "Tagged user not found."}), 404

        # Pretraga diskusije prema ID-u
        discussion = get_discussion_by_id(discussion_id)
        if not discussion:
            return jsonify({"error_code": "DISCUSSION_NOT_FOUND", "message": "Discussion not found."}), 404

        # Priprema sadržaja poruke
        if comment_id:
            # Ako je comment_id prisutan, tagovanje se odnosi na komentar
            comment = get_comment_by_id(comment_id)
            if not comment:
                return jsonify({"error_code": "COMMENT_NOT_FOUND", "message": "Comment not found."}), 404

            message = f"User {user.username} has mentioned you in {discussion.title} discussion comments: {comment.content}"
        else:
            # Ako nije comment_id, tagovanje je u diskusiji
            message = f"User {user.username} has mentioned you in {discussion.title} discussion."

        # Slanje e-mail obaveštenja korisniku
        email_sender = EmailSender()  # Kreiranje instance EmailSender-a
        email_sender.send_email(
            recipient=tagged_user.email,
            subject=f"You're mentioned in {discussion.title} discussion",
            body=message
        )

        return jsonify({"message": "User tagged successfully and email sent."}), 200

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}), 500