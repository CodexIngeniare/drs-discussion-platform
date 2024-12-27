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


def get_default_topic():
    try:
       
        default_topic = Topic.query.filter_by(description="default").first()
        return default_topic
    except SQLAlchemyError as e:
        print(f"Greška prilikom dohvatanja default teme: {str(e)}")
        return None


def delete_topic(topic_id):
    try:
        
        default_topic = get_default_topic()

        if not default_topic:
            print("Default topic nije pronađen!")
            return False

      
        if topic_id == default_topic.id:
            print("Ne može se obrisati default topic.")
            return False

       
        topic = Topic.query.get(topic_id)
        if not topic:
            print("Tema nije pronađena!")
            return False

        
        Discussion.query.filter_by(topic_id=topic_id).update({"topic_id": default_topic.id})

     
        db.session.delete(topic)
        db.session.commit()
        return True
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Greška prilikom brisanja teme: {str(e)}")
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
