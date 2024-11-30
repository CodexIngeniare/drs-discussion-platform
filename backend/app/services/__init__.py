# services/__init__.py

from models import User, Discussion, Comment, Topic, db
from flask_mail import Message
from app import mail
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user

# 1. Registracija novog korisnika
def register_user(username, email, password):
    # Provera da li korisničko ime ili email već postoje u bazi
    existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        return False  # Korisnik sa tim korisničkim imenom ili emailom već postoji

    # Kreiranje novog korisnika
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()
    
    # Slanje email obaveštenja korisniku o uspešnoj registraciji
    send_email(email, 'Registracija potvrđena', f"Vaš nalog sa korisničkim imenom {username} je uspešno registrovan.")
    return True

# 2. Prijava korisnika
def login_user_func(email, password):
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        return user
    return None

# 3. Potvrda korisnika od strane administratora
def approve_user(user_id):
    user = User.query.get(user_id)
    if user:
        user.is_verified = True
        db.session.commit()
        
        # Slanje email obaveštenja korisniku o potvrdi
        send_email(user.email, 'Vaša registracija je potvrđena', f"Vaš nalog sa korisničkim imenom {user.username} je sada potvrđen!")
        return True
    return False

# 4. Odbijanje korisnika od strane administratora
def reject_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()

        # Slanje email obaveštenja korisniku o odbijanju
        send_email(user.email, 'Vaša registracija je odbijena', f"Nažalost, vaša registracija sa korisničkim imenom {user.username} je odbijena.")
        return True
    return False

# 5. Dodavanje nove diskusije
def create_discussion(title, content, user_id, topic_id):
    discussion = Discussion(title=title, content=content, user_id=user_id, topic_id=topic_id)
    db.session.add(discussion)
    db.session.commit()
    return discussion

# 6. Izmena diskusije
def update_discussion(discussion_id, title, content):
    discussion = Discussion.query.get(discussion_id)
    if discussion:
        discussion.title = title
        discussion.content = content
        db.session.commit()
        return discussion
    return None

# 7. Brisanje diskusije
def delete_discussion(discussion_id):
    discussion = Discussion.query.get(discussion_id)
    if discussion:
        db.session.delete(discussion)
        db.session.commit()
        return True
    return False

# 8. Dodavanje komentara na diskusiju
def add_comment(user_id, discussion_id, content):
    comment = Comment(content=content, user_id=user_id, discussion_id=discussion_id)
    db.session.add(comment)
    db.session.commit()
    return comment

# 9. Brisanje komentara (korisnik može da obriše samo svoje komentare)
def delete_comment(comment_id, user_id):
    comment = Comment.query.get(comment_id)
    if comment and comment.user_id == user_id:
        db.session.delete(comment)
        db.session.commit()
        return True
    return False

# 10. Lajkovanje i dislajkovanje diskusije
def like_dislike_discussion(user_id, discussion_id, like=True):
    # Provera da li korisnik već lajkovao ili dislajkovao ovu diskusiju
    existing_reaction = LikeDislike.query.filter_by(user_id=user_id, discussion_id=discussion_id).first()
    
    if existing_reaction:
        # Ako je već lajkovao, promeniti reakciju
        if existing_reaction.is_liked == like:
            return "Već ste reagovali na ovu diskusiju."
        
        # Ako je lajkovao, promeniti na dislajk, ili obrnuto
        existing_reaction.is_liked = like
        db.session.commit()
        return "Vaša reakcija je ažurirana."
    
    # Ako korisnik još nije reagovao, kreirati novu reakciju
    new_reaction = LikeDislike(user_id=user_id, discussion_id=discussion_id, is_liked=like)
    db.session.add(new_reaction)
    db.session.commit()
    
    return "Reakcija uspešno postavljena."

# 11. Pretraga diskusija po različitim parametrima
def search_discussions(search_term):
    discussions = Discussion.query.filter(
        (Discussion.title.like(f'%{search_term}%')) | 
        (Discussion.content.like(f'%{search_term}%'))
    ).all()
    return discussions

# 12. Slanje email obaveštenja
def send_email(to, subject, body):
    msg = Message(subject, recipients=[to])
    msg.body = body
    mail.send(msg)
