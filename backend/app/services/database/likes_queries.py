from app import db
from app.models.likes import Like


def like_or_dislike(discussion_id, user_id, status):
    try:
        # Ako je status neutral, pokušaj da izbrišeš lajk/dislajk ako postoji
        if status == "neutral":
            # Pokušaj da pronađeš postojeći lajk/dislajk
            existing_like = db.session.query(Like).filter_by(user_id=user_id, discussion_id=discussion_id).first()

            if existing_like:
                # Ako postoji, obriši ga iz baze
                db.session.delete(existing_like)
                db.session.commit()
                return {"message": "Like/Dislike removed successfully."}  # Poruka o uspešnom uklanjanju
            else:
                return {"message": "No like/dislike found to remove."}  # Ako ne postoji lajk/dislajk za brisanje

        # Ako je status "like" ili "dislike", ažuriraj ili kreiraj novi unos
        is_like = (status == "like")

        # Pokušaj da pronađeš postojeći lajk/dislajk
        existing_like = db.session.query(Like).filter_by(user_id=user_id, discussion_id=discussion_id).first()

        if existing_like:
            # Ako već postoji, ažuriraj 'is_like' polje
            existing_like.is_like = is_like
            db.session.commit()
            # Poruka sa informacijom da je lajk ili dislajk postavljen
            return {"message": "Like updated successfully."} if is_like else {"message": "Dislike updated successfully."}
        else:
            # Ako ne postoji, kreiraj novi lajk/dislajk
            new_like = Like(user_id=user_id, discussion_id=discussion_id, is_like=is_like)
            db.session.add(new_like)
            db.session.commit()
            # Poruka sa informacijom o novom lajku ili dislajku
            return {"message": "Like created successfully."} if is_like else {"message": "Dislike created successfully."}

    except Exception as e:
        db.session.rollback()
        print(f"Greška prilikom lajkovanja/dislajkovanja: {str(e)}")
    return None