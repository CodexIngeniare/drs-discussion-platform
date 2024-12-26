from app import db
from app.models.discussions import Discussion
from app.models.comments import Comment  
from sqlalchemy.exc import SQLAlchemyError

def create_discussion(title, content, user_id, topic_id):

    try:
        new_discussion = Discussion(
            title=title, 
            content=content, 
            user_id=user_id, 
            topic_id=topic_id
        )
        db.session.add(new_discussion)
        db.session.commit()
        return new_discussion
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Greška: {str(e)}")
        return None


def update_discussion(discussion_id, title=None, content=None, topic_id=None):

    try:
        discussion = Discussion.query.get(discussion_id)
        if not discussion:
            return None

        if title:
            discussion.title = title
        if content:
            discussion.content = content
        if topic_id:
            discussion.topic_id = topic_id

        db.session.commit()
        return discussion
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Greška: {str(e)}")
        return None


def delete_discussion(discussion_id):

    try:
        discussion = Discussion.query.get(discussion_id)
        if not discussion:
            return False

        # Obriši sve komentare koji pripadaju diskusiji
        Comment.query.filter_by(discussion_id=discussion_id).delete()

        # Obriši diskusiju
        db.session.delete(discussion)
        db.session.commit()
        return True
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Greška: {str(e)}")
        return False


def get_all_discussions():

    try:
        return Discussion.query.all()
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return None


def get_discussion_by_id(discussion_id):

    try:
        return Discussion.query.get(discussion_id)
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return None
