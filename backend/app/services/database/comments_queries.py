from app import db
from app.models import Comment, RegisteredUser
from sqlalchemy.exc import SQLAlchemyError

def create_comment(discussion_id, user_id, content):

    try:
        new_comment = Comment(discussion_id=discussion_id, user_id=user_id, content=content)
        db.session.add(new_comment)
        db.session.commit()
        return new_comment
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Greška: {str(e)}")
        return None


def delete_comment(comment_id):

    try:
        comment = Comment.query.get(comment_id)
        if not comment:
            return False

        db.session.delete(comment)
        db.session.commit()
        return True
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Greška: {str(e)}")
        return False


def get_all_comments():

    try:
        return Comment.query.all()
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return None


def get_comments_by_discussion_id(discussion_id):
    try:
        comments = db.session.query(Comment).filter_by(discussion_id=discussion_id).all()

        comments = (
            db.session.query(Comment, RegisteredUser.username.label('author_username'))
            .outerjoin(RegisteredUser, RegisteredUser.id == Comment.user_id)
            .filter(Comment.discussion_id == discussion_id)
            .all()
        )
        print(comments)
        result = []
        for comment, author_username in comments:
            result.append({
                "id": comment.id,
                "user_id": comment.user_id,
                "author_username": author_username,
                "discussion_id": comment.discussion_id,
                "content": comment.content,
                "created_at": comment.created_at.isoformat() if comment.created_at else None,  
                "updated_at": comment.updated_at.isoformat() if comment.updated_at else None  
            })
        return result
    except Exception as e:
        print(f"Error retrieving comments: {str(e)}")
        return None

def get_comment_by_id(comment_id):

    try:
        return Comment.query.get(comment_id)
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return None
