from flask import Blueprint, request
from app.services.database import (
    get_admin_emails,
    get_all_pending_users, 
    get_all_registered_users, 
    approve_user, 
    get_user_by_email, 
    log_user_login,
    is_email_registered,
    register_new_user,
    update_user_data,
    get_user_by_username  
)

from app.services.database import (
    create_topic,
    update_topic,
    delete_topic,
    get_all_topics,
    get_topic_by_id
)

from app.services.database import (
    create_discussion,
    update_discussion,
    delete_discussion,
    get_all_discussions,
    get_discussion_by_id,
    search_discussions
)

from app.services.database import (
    create_comment,
    delete_comment,
    get_all_comments,
    get_comment_by_id,
    get_comments_by_discussion_id
)

from app.services.database import(
    like_or_dislike
)

db_bp = Blueprint('db_bp', __name__)

# Dohvatanje svih korisnika koji čekaju odobrenje
@db_bp.route('/db/get_pending_users', methods=['GET'])
def db_get_pending_users():
    try:
        users = get_all_pending_users()
        if users is None:
            raise Exception("Došlo je do greške prilikom dohvatanja korisnika koji čekaju odobrenje.")

        # Vraća podatke kao obične objekte (Python objekti)
        return [{
            "id": user.id,
            "username": user.username,
            "registration_status": user.registration_status
        } for user in users], 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500

# Dohvatanje svih registrovanih korisnika
@db_bp.route('/db/get_registered_users', methods=['GET'])
def db_get_registered_users():
    try:
        users = get_all_registered_users()
        if users is None:
            raise Exception("Došlo je do greške prilikom dohvatanja registrovanih korisnika.")

        # Vraća podatke kao obične objekte (Python objekti)
        return [{
            "id": user.id,
            "username": user.username,
            "last_logged_in": user.last_logged_in
        } for user in users], 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500

# Odobravanje korisnika i prebacivanje u `registered_users`
@db_bp.route('/db/approve_user/<int:user_id>', methods=['POST'])
def db_approve_user(user_id):
    try:
        user = approve_user(user_id)
        if user is None:
            raise Exception(f"Korisnik sa ID {user_id} nije pronađen ili nije mogao biti odobren.")

        # Vraća podatke o uspešnom odobravanju kao objekat
        return {
            "id": user.id,
            "username": user.username
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500

# Logovanje korisnika - postavljanje trenutnog datuma i vremena poslednjeg logovanja
@db_bp.route('/db/log_user_login/<string:email>', methods=['POST'])
def db_log_user_login(email):
    try:
        user = log_user_login(email)
        if user is None:
            raise Exception(f"Korisnik sa emailom {email} nije pronađen.")

        # Vraća podatke o uspešnom logovanju
        return {
            "id": user.id,
            "username": user.username,
            "last_logged_in": user.last_logged_in
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500

# Provera da li je email u upotrebi
@db_bp.route('/db/email_in_use/<string:email>', methods=['GET'])
def db_email_already_in_use(email):
    try:
        result = is_email_registered(email)
        return {"email_in_use": result}, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500


# Endpoint za registraciju novog korisnika
@db_bp.route('/db/register_new_user/<string:email>', methods=['POST'])
def db_register_new_user(email):
    try:
        form_data = request.get_json()  # Dobijamo podatke u JSON formatu iz tela zahteva
        user = register_new_user(email, form_data)
        
        if user is None:
            raise Exception(f"Email {email} je već u upotrebi ili je došlo do greške prilikom registracije.")

        # Uspešna registracija
        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "username": user.username
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500
    

@db_bp.route('/db/get_user_data/<string:email>', methods=['GET'])
def db_get_user_data(email):
    try:
        # Pozivamo funkciju koja pretražuje registrovane korisnike po email-u
        user = get_user_by_email(email)
        if user is None:
            return {"user_data": None}, 200
        
        # Vraćamo podatke o korisniku
        return {
            "user_data": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "username": user.username,
                "last_logged_in": user.last_logged_in,
                "is_admin" : user.is_admin
            }
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500




# Ažuriranje podataka korisnika
@db_bp.route('/db/update_user_data/<string:email>', methods=['POST'])
def db_update_user_data(email):
    try:
        form_data = request.get_json()  # Preuzimamo podatke iz POST zahteva
        user = update_user_data(email, form_data)
        if not user:
            raise Exception(f"Korisnik sa emailom {email} nije pronađen.")
        
        # Vraćamo ažurirane podatke korisnika (iz objekta u rečnik)
        return {
            "status": "success",
            "user_data": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "username": user.username,
                "last_logged_in": user.last_logged_in
            }
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500
    

    # Dohvatanje svih email-ova admina
@db_bp.route('/db/get_all_admin_emails', methods=['GET'])
def db_get_all_admin_emails():
    try:
        # Pozivamo funkciju koja vraća sve email adrese admina
        admin_emails = get_admin_emails()
        
        if not admin_emails:
            raise Exception("Došlo je do greške prilikom dohvatanja email adresa admina.")

        # Vraćamo listu email adresa
        return {"admin_emails": admin_emails}, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500
    

    # Kreiranje nove teme
@db_bp.route('/db/topic/create', methods=['POST'])
def db_create_topic():
    try:
        form_data = request.get_json()
        name = form_data.get("name")
        description = form_data.get("description")

        if not name:
            raise ValueError("Naziv teme je obavezan.")

        topic = create_topic(name=name, description=description)

        if not topic:
            raise Exception("Došlo je do greške prilikom kreiranja teme.")

        return {
            "status": "success",
            "topic": {
                "id": topic.id,
                "name": topic.name,
                "description": topic.description
            }
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500

# Ažuriranje postojeće teme
@db_bp.route('/db/topic/update/<int:topic_id>', methods=['POST'])
def db_update_topic(topic_id):
    try:
        form_data = request.get_json()
        name = form_data.get("name")
        description = form_data.get("description")

        topic = update_topic(topic_id=topic_id, name=name, description=description)

        if not topic:
            raise Exception(f"Tema sa ID {topic_id} nije pronađena ili nije mogla biti ažurirana.")

        return {
            "status": "success",
            "topic": {
                "id": topic.id,
                "name": topic.name,
                "description": topic.description
            }
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500

@db_bp.route('/db/topic/delete/<int:topic_id>', methods=['POST'])
def db_delete_topic(topic_id):
    try:
       
        success = delete_topic(topic_id)

        if success:
            return {
                "status": "success",
                "message": "Tema je uspešno obrisana."
            }, 200
        else:
            return {
                "status": "error",
                "message": "Došlo je do greške prilikom brisanja teme."
            }, 400
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500

# Dohvatanje svih tema
@db_bp.route('/db/topic/get_all', methods=['GET'])
def db_get_all_topics():
    try:
        topics = get_all_topics()

        if topics is None:
            raise Exception("Došlo je do greške prilikom dohvatanja svih tema.")

        return {
            "status": "success",
            "topics": [
                {
                    "id": topic.id,
                    "name": topic.name,
                    "description": topic.description
                } for topic in topics
            ]
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500

# Dohvatanje teme po ID-u
@db_bp.route('/db/topic/get/<int:topic_id>', methods=['GET'])
def db_get_topic_by_id(topic_id):
    try:
        topic = get_topic_by_id(topic_id)

        if not topic:
            return {
                "status": "success",
                "topic": None
            }, 200

        return {
            "status": "success",
            "topic": {
                "id": topic.id,
                "name": topic.name,
                "description": topic.description
            }
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500
    
    # Kreiranje nove diskusije
@db_bp.route('/db/discussion/create', methods=['POST'])
def db_create_discussion():
    try:
        form_data = request.get_json()

        title = form_data.get("title")
        content = form_data.get("content")
        user_id = form_data.get("user_id")
        topic_id = form_data.get("topic_id")

        if not title or not content or not user_id or not topic_id:
            raise ValueError("Svi podaci (title, content, user_id, topic_id) su obavezni.")

        discussion = create_discussion(title=title, content=content, user_id=user_id, topic_id=topic_id)

        if not discussion:
            raise Exception("Došlo je do greške prilikom kreiranja diskusije.")

        return {
            "status": "success",
            "message": f"Diskusija '{discussion.title}' je uspešno kreirana."
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500


# Ažuriranje diskusije
@db_bp.route('/db/discussion/update/<int:discussion_id>', methods=['POST'])
def db_update_discussion(discussion_id):
    try:
        form_data = request.get_json()

        title = form_data.get("title")
        content = form_data.get("content")
        topic_id = form_data.get("topic_id")

        discussion = update_discussion(discussion_id=discussion_id, title=title, content=content, topic_id=topic_id)

        if not discussion:
            raise Exception(f"Diskusija sa ID {discussion_id} nije pronađena ili došlo je do greške prilikom ažuriranja.")

        return {
            "status": "success",
            "message": f"Diskusija sa ID {discussion_id} je uspešno ažurirana."
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500


# Brisanje diskusije
@db_bp.route('/db/discussion/delete/<int:discussion_id>', methods=['POST'])
def db_delete_discussion(discussion_id):
    try:
        success = delete_discussion(discussion_id=discussion_id)

        if not success:
            raise Exception(f"Diskusija sa ID {discussion_id} nije pronađena ili došlo je do greške prilikom brisanja.")

        return {
            "status": "success",
            "message": f"Diskusija sa ID {discussion_id} je uspešno obrisana, uključujući sve komentare."
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500


@db_bp.route('/db/discussions', methods=['GET'])
def db_get_all_discussions():
    try:
        discussions = get_all_discussions()

        if not discussions:
            return {
                "status": "success",
                "message": "Nema diskusija u bazi.",
                "discussions": []
            }, 200

        return {
            "status": "success",
            "discussions": discussions  
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500


# Dohvat diskusije po ID-u
@db_bp.route('/db/discussion/<int:discussion_id>', methods=['GET'])
def db_get_discussion_by_id(discussion_id):
    try:
        discussion = get_discussion_by_id(discussion_id)

        if not discussion:
            raise Exception(f"Diskusija sa ID {discussion_id} nije pronađena.")

        return {
            "status": "success",
            "discussion": {
                "id": discussion.id,
                "title": discussion.title,
                "content": discussion.content
            }
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500


@db_bp.route('/db/comment', methods=['POST'])
def db_create_comment():
    try:
        form_data = request.get_json()
        content = form_data.get('content')
        user_id = form_data.get('user_id')
        discussion_id = form_data.get('discussion_id')

        if not content or not user_id or not discussion_id:
            raise ValueError("Svi podaci (content, user_id, discussion_id) su obavezni.")

        new_comment = create_comment(content=content, user_id=user_id, discussion_id=discussion_id)

        if not new_comment:
            raise Exception("Greška pri kreiranju komentara.")

        return {
            "status": "success",
            "message": "Komentar je uspešno kreiran.",
            "comment": {
                "id": new_comment.id,
                "content": new_comment.content,
                "user_id": new_comment.user_id,
                "discussion_id": new_comment.discussion_id
            }
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500
    

@db_bp.route('/db/comment/delete/<int:comment_id>', methods=['POST'])
def db_delete_comment(comment_id):
    try:
        success = delete_comment(comment_id)

        if not success:
            raise Exception(f"Komentar sa ID {comment_id} nije pronađen ili nije mogao biti obrisan.")

        return {
            "status": "success",
            "message": f"Komentar sa ID {comment_id} je uspešno obrisan."
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500
    

@db_bp.route('/db/comments', methods=['GET'])
def db_get_all_comments():
    try:
        comments = get_all_comments()

        if not comments:
            raise Exception("Nema komentara u bazi.")

        comments_list = [{
            "id": comment.id,
            "content": comment.content,
            "user_id": comment.user_id,
            "discussion_id": comment.discussion_id
        } for comment in comments]

        return {
            "status": "success",
            "comments": comments_list
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500

    

@db_bp.route('/db/comment/<int:comment_id>', methods=['GET'])
def db_get_comment_by_id(comment_id):
    try:
        comment = get_comment_by_id(comment_id)

        if not comment:
            raise Exception(f"Komentar sa ID {comment_id} nije pronađen.")

        return {
            "status": "success",
            "comment": {
                "id": comment.id,
                "content": comment.content,
                "user_id": comment.user_id,
                "discussion_id": comment.discussion_id
            }
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500
    
@db_bp.route('/db/like_or_dislike', methods=['POST'])
def db_like_or_dislike():
    try:
        # Uzimanje podataka iz tela zahteva
        form_data = request.get_json()
        user_id = form_data.get("user_id")
        discussion_id = form_data.get("discussion_id")
        is_like = form_data.get("is_like")

        if user_id is None or discussion_id is None or is_like is None:
            raise ValueError("Svi podaci (user_id, discussion_id, is_like) su obavezni.")

        # Poziv funkcije za lajkovanje ili dislajkovanje
        like = like_or_dislike(discussion_id, user_id, is_like)

        if not like:
            raise Exception("Došlo je do greške prilikom lajkovanja/dislajkovanja.")

        return {
            "status": "success",
            "message": "Lajk/dislajk je uspešno postavljen.",
            "like": {
                "user_id": like.user_id,
                "discussion_id": like.discussion_id,
                "is_like": like.is_like
            }
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500
    
@db_bp.route('/db/discussion/comments/<int:discussion_id>', methods=['GET'])
def db_get_comments_by_discussion(discussion_id):
    try:
        comments = get_comments_by_discussion_id(discussion_id)

        if not comments:
            return {
                "status": "success",
                "comments": None  
            }, 200

        return {
            "status": "success",
            "comments": comments  
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500
    


# Dohvatanje registrovanog korisnika po korisničkom imenu
@db_bp.route('/db/get_user_by_username/<string:username>', methods=['GET'])
def db_get_user_by_username(username):
    try:
        user = get_user_by_username(username)
        if not user:
            raise Exception(f"Korisnik sa korisničkim imenom '{username}' nije pronađen.")

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "last_logged_in": user.last_logged_in
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500
    
@db_bp.route('/db/search_discussions', methods=['GET'])
def db_search_discussions():
    try:
        # Uzimanje parametara iz query stringa
        topic_id = request.args.get('topic_id', type=int)
        discussion_title = request.args.get('discussion_title', type=str)
        author_username = request.args.get('author_username', type=str)
        author_email = request.args.get('author_email', type=str)

        # Pozivanje funkcije za pretragu diskusija sa prosleđenim parametrima
        discussions = search_discussions(topic_id, discussion_title, author_username, author_email)

        # Ako nema diskusija
        if not discussions:
            return {
                "status": "success",
                "message": "Nema diskusija koje odgovaraju zadatim parametrima.",
                "discussions": []
            }, 200

        # Vraćamo rezultat pretrage
        return {
            "status": "success",
            "discussions": discussions
        }, 200

    except Exception as e:
        # Obrada grešaka
        return {
            "status": "error",
            "message": str(e)
        }, 500