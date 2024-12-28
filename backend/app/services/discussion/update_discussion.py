from app.services.database.discussions_queries import get_discussion_by_id, update_discussion

def update_discussion_service(discussion_id, user_id, is_admin, title=None, content=None, topic_id=None):
    # Provera da li diskusija postoji
    discussion = get_discussion_by_id(discussion_id)
    if not discussion:
        return {"error_code": "NOT_FOUND", "message": "Discussion not found."}, 404

    # Provera prava korisnika (autor ili admin)
    if discussion.user_id != user_id and not is_admin:
        return {"error_code": "FORBIDDEN", "message": "You are not authorized to update this discussion."}, 403

    # Ažuriranje diskusije
    updated_discussion = update_discussion(discussion_id, title, content, topic_id)
    if not updated_discussion:
        return {"error_code": "SERVER_ERROR", "message": "Failed to update discussion."}, 500

    # Uspešan rezultat
    return {
        "message": "Discussion updated successfully.",
        "discussion": {
            "id": updated_discussion.id,
            "title": updated_discussion.title,
            "content": updated_discussion.content,
            "topic_id": updated_discussion.topic_id,
            "user_id": updated_discussion.user_id,
            "updated_at": updated_discussion.updated_at.isoformat()
        }
    },200