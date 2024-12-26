from app import db
from app.models.comments import Comment
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


def get_comment_by_id(comment_id):

    try:
        return Comment.query.get(comment_id)
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return None
