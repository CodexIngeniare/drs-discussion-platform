from app.services.database.discussions_queries import get_discussion_by_id, delete_discussion

def delete_discussion_service(discussion_id, user_id, is_admin):
    # Provera da li diskusija postoji
    discussion = get_discussion_by_id(discussion_id)
    if not discussion:
        return {"error_code": "NOT_FOUND", "message": "Discussion not found."}, 404

    # Provera prava korisnika (autor ili admin)
    if discussion.user_id != user_id and not is_admin:
        return {"error_code": "FORBIDDEN", "message": "You are not authorized to delete this discussion."}, 403

    # Brisanje diskusije
    if not delete_discussion(discussion_id):
        return {"error_code": "SERVER_ERROR", "message": "Failed to delete discussion."}, 500

    # Uspešan rezultat
    return {"message": "Discussion deleted successfully."},200