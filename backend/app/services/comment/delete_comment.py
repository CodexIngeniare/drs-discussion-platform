from app.services.database.comments_queries import delete_comment, get_comment_by_id
from app.services.database.discussions_queries import get_discussion_by_id

def delete_comment_service(comment_id, user_id, is_admin):
    """
    Servisna funkcija za brisanje komentara.
    """
    try:
        # Provera da li komentar postoji
        comment = get_comment_by_id(comment_id)
        if not comment:
            return {"error_code": "NOT_FOUND", "message": "Comment not found."}, 404

        # Provera prava korisnika
        if not (is_admin or comment.user_id == user_id):  # Autor komentara
            discussion = get_discussion_by_id(comment.discussion_id)
            if not (discussion and discussion.user_id == user_id):  # Autor diskusije
                return {"error_code": "FORBIDDEN", "message": "You are not authorized to delete this comment."}, 403

        # Brisanje komentara
        if not delete_comment(comment_id):
            return {"error_code": "SERVER_ERROR", "message": "Failed to delete comment."}, 500

        return {"message": "Comment deleted successfully."}, 200

    except Exception as e:
        return {"error_code": "SERVER_ERROR", "message":str(e)},500