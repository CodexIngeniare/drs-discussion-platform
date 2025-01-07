from sqlalchemy import alias, case, func
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
        # Napravite upit koji uključuje broj lajkova, broj dislajkova, korisničko ime autora i naziv teme
        discussions = (
            db.session.query(
                Discussion,
                func.sum(case((Like.is_like == True, 1), else_=0)).label('like_count'),
                func.sum(case((Like.is_like == False, 1), else_=0)).label('dislike_count'),
                Topic.name.label('topic_name'),
                RegisteredUser.username.label('author_username')
            )
            .outerjoin(Like, Like.discussion_id == Discussion.id)
            .outerjoin(Topic, Topic.id == Discussion.topic_id)
            .outerjoin(RegisteredUser, RegisteredUser.id == Discussion.user_id)
            .group_by(Discussion.id, Topic.id, RegisteredUser.id)
            .order_by(Discussion.created_at.desc())
            .all()
        )

        # Formatiranje rezultata
        result = []
        for discussion, like_count, dislike_count, topic_name, author_username in discussions:
            discussion_dict = discussion.to_dict()  # Preuzimanje osnovnih polja iz modela
            discussion_dict['like_count'] = like_count
            discussion_dict['dislike_count'] = dislike_count
            discussion_dict['topic_name'] = topic_name or "Uncategorized"  # Dodavanje naziva teme
            discussion_dict['author_username'] = author_username  # Dodavanje korisničkog imena autora
            result.append(discussion_dict)

        return result
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return None


def get_discussion_by_id(discussion_id):
    try:
        # Upit za dohvatanje diskusije zajedno sa dodatnim informacijama
        discussion = (
            db.session.query(
                Discussion.id,
                Discussion.title,
                Discussion.content,
                Discussion.created_at,
                Discussion.updated_at,
                RegisteredUser.username.label("author_username"),
                Topic.name.label("topic_name"),
                func.count(func.nullif(Like.is_like, False)).label("like_count"),  # Broj lajkova
                func.count(func.nullif(Like.is_like, True)).label("dislike_count")  # Broj dislajkova
            )
            .join(RegisteredUser, RegisteredUser.id == Discussion.user_id)
            .join(Topic, Topic.id == Discussion.topic_id)
            .outerjoin(Like, Like.discussion_id == Discussion.id)
            .filter(Discussion.id == discussion_id)
            .group_by(
                Discussion.id,
                RegisteredUser.username,
                Topic.name
            )
            .first()
        )

        if not discussion:
            return None  # Diskusija nije pronađena

        # Konvertovanje rezultata u rečnik
        return {
            "id": discussion.id,
            "title": discussion.title,
            "content": discussion.content,
            "created_at": discussion.created_at.isoformat() if discussion.created_at else None,
            "updated_at": discussion.updated_at.isoformat() if discussion.updated_at else None,
            "author_username": discussion.author_username,
            "topic_name": discussion.topic_name,
            "like_count": discussion.like_count,
            "dislike_count": discussion.dislike_count
        }

    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return None

def search_discussions(topic_id=None, discussion_title=None, author_username=None, author_email=None):
    # Kreiranje alias-a za tabelu RegisteredUser
    Author = alias(RegisteredUser)  # Alias za autora diskusije

    # Subquery za broj lajkova
    like_count_subquery = db.session.query(
        Like.discussion_id,
        func.count().label('like_count')
    ).filter(Like.is_like == True).group_by(Like.discussion_id).subquery()

    # Subquery za broj dislajkova
    dislike_count_subquery = db.session.query(
        Like.discussion_id,
        func.count().label('dislike_count')
    ).filter(Like.is_like == False).group_by(Like.discussion_id).subquery()

    query = db.session.query(Discussion, like_count_subquery.c.like_count, dislike_count_subquery.c.dislike_count,
                             Topic.name.label('topic_name'), Author.c.username.label('author_username')) \
        .join(Author, Author.c.id == Discussion.user_id) \
        .outerjoin(like_count_subquery, like_count_subquery.c.discussion_id == Discussion.id) \
        .outerjoin(dislike_count_subquery, dislike_count_subquery.c.discussion_id == Discussion.id) \
        .outerjoin(Topic, Topic.id == Discussion.topic_id)

    # Filtriranje po topic_id i naslovu diskusije
    if topic_id is not None:
        query = query.filter(Discussion.topic_id == topic_id)
    if discussion_title:
        query = query.filter(Discussion.title.ilike(f'%{discussion_title}%'))

    # Dodavanje filtera za autora diskusije prema username ili email
    if author_username:
        query = query.filter(Author.c.username.ilike(f'%{author_username}%'))

    if author_email:
        query = query.filter(Author.c.email.ilike(f'%{author_email}%'))

    # Grupisanje i sortiranje
    query = query.group_by(Discussion.id, Topic.id, Author.c.username) \
                 .order_by(Discussion.created_at.desc())

    # Dohvatanje rezultata
    discussions = query.all()

    # Formiranje liste diskusija sa dodatnim podacima
    discussion_list = []
    for discussion in discussions:
        # Pristup svim podacima
        discussion_dict = discussion[0].to_dict()  # Pretpostavljamo da je 0. element Discussion objekat
        discussion_dict['like_count'] = discussion[1] if discussion[1] is not None else 0
        discussion_dict['dislike_count'] = discussion[2] if discussion[2] is not None else 0
        discussion_dict['topic_name'] = discussion[3]
        discussion_dict['author_username'] = discussion[4]
        discussion_list.append(discussion_dict)

    return discussion_list
