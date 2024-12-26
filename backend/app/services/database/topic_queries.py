from app import db
from app.models.topics import Topic
from app.models.discussions import Discussion
from sqlalchemy.exc import SQLAlchemyError


def create_topic(name, description=None):

    try:
        new_topic = Topic(name=name, description=description)
        db.session.add(new_topic)
        db.session.commit()
        return new_topic
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Greška: {str(e)}")
        return None


def update_topic(topic_id, name=None, description=None):

    try:
        topic = Topic.query.get(topic_id)
        if not topic:
            return None

        if name:
            topic.name = name
        if description:
            topic.description = description

        db.session.commit()
        return topic
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Greška: {str(e)}")
        return None


def delete_topic(topic_id, default_topic_id):

    try:
        topic = Topic.query.get(topic_id)
        if not topic:
            return False

        # Ažuriraj diskusije koje koriste ovu temu
        Discussion.query.filter_by(topic_id=topic_id).update({"topic_id": default_topic_id})

        # Obriši temu
        db.session.delete(topic)
        db.session.commit()
        return True
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Greška: {str(e)}")
        return False


def get_all_topics():

    try:
        return Topic.query.all()
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return None


def get_topic_by_id(topic_id):

    try:
        return Topic.query.get(topic_id)
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return None
