from app import db
from app.models.likes import Like

def like_or_dislike(discussion_id, user_id, is_like):
    try:
        # Pokušaj da pronađeš postojeći lajk/dislajk
        existing_like = db.session.query(Like).filter_by(user_id=user_id, discussion_id=discussion_id).first()

        if existing_like:
            # Ako već postoji, ažuriraj 'is_like' polje
            existing_like.is_like = is_like
            db.session.commit()
            return existing_like  # Vraća ažurirani lajk/dislajk
        else:
            # Ako ne postoji, kreiraj novi lajk/dislajk
            new_like = Like(user_id=user_id, discussion_id=discussion_id, is_like=is_like)
            db.session.add(new_like)
            db.session.commit()
            return new_like  # Vraća novi lajk/dislajk
    except Exception as e:
        db.session.rollback()
        print(f"Greška prilikom lajkovanja/dislajkovanja: {str(e)}")
        return None