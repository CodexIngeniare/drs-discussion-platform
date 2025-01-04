from sqlalchemy import func
from app import db
from app.models.discussions import Discussion
from app.models.comments import Comment  
from sqlalchemy.exc import SQLAlchemyError

from app.models.likes import Like
from app.models.registered_users import RegisteredUser
from app.models.topics import Topic

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
        # Napravite upit koji uključuje broj lajkova i naziv teme
        discussions = (
            db.session.query(
                Discussion,
                func.count(Like.id).label('like_count'),
                Topic.name.label('topic_name')
            )
            .outerjoin(Like, Like.discussion_id == Discussion.id)
            .outerjoin(Topic, Topic.id == Discussion.topic_id)
            .group_by(Discussion.id, Topic.id)
            .order_by(Discussion.created_at.desc())
            .all()
        )

        # Formatiranje rezultata
        result = []
        for discussion, like_count, topic_name in discussions:
            discussion_dict = discussion.to_dict()  # Preuzimanje osnovnih polja iz modela
            discussion_dict['like_count'] = like_count
            discussion_dict['topic_name'] = topic_name or "Uncategorized"  # Dodavanje naziva teme
            result.append(discussion_dict)

        return result
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return None


def get_discussion_by_id(discussion_id):

    try:
        return Discussion.query.get(discussion_id)
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return None

def search_discussions(topic_id=None, discussion_title=None, author_username=None, author_email=None):
    # Početni query za tabelu Discussion
    query = db.session.query(Discussion)

    # Filtriranje na osnovu prosleđenih parametara
    if topic_id is not None:  # Proveravamo da li je parametar prosleđen
        query = query.filter(Discussion.topic_id == topic_id)
    if discussion_title:
        query = query.filter(Discussion.title.ilike(f'%{discussion_title}%'))

    # Ako se filtrira po korisniku, prvo dodajemo JOIN sa tabelom RegisteredUser
    if author_username:
        query = query.join(RegisteredUser, RegisteredUser.id == Discussion.user_id) \
                     .filter(RegisteredUser.username.ilike(f'%{author_username}%'))
    
    if author_email:
        query = query.join(RegisteredUser, RegisteredUser.id == Discussion.user_id) \
                     .filter(RegisteredUser.email.ilike(f'%{author_email}%'))

    # Dodavanje broja lajkova i naziva teme
    query = query.outerjoin(Like, Like.discussion_id == Discussion.id) \
                 .outerjoin(Topic, Topic.id == Discussion.topic_id) \
                 .add_columns(db.func.count(Like.id).label('like_count'),
                              Topic.name.label('topic_name')) \
                 .group_by(Discussion.id, Topic.id)

    # Sortiranje od najnovije do najstarije diskusije
    query = query.order_by(Discussion.created_at.desc())

    # Pozivanje .all() tek na kraju nakon što su svi JOIN-ovi i filtriranja završeni
    discussions = query.all()

    # Priprema rezultata
    discussion_list = []
    for discussion in discussions:
        # Objekat Discussion
        discussion_dict = discussion[0].to_dict()  
        # Dodajemo broj lajkova, naziv teme
        discussion_dict['like_count'] = discussion.like_count  
        discussion_dict['topic_name'] = discussion.topic_name  
        discussion_list.append(discussion_dict)

    return discussion_list
