from app import db
from app.models.likes import Like

def like_or_dislike(discussion_id, user_id, is_like=None):

    try:
        # Proveri da li postoji zapis za korisnika i diskusiju
        existing_like = db.session.query(Like).filter_by(user_id=user_id, discussion_id=discussion_id).first()

        if is_like is None:
            # Ako korisnik nije lajkovao ili dislajkovao, ostavi neutralno stanje
            if existing_like:
                db.session.delete(existing_like)  # Obrisi postojeći zapis
                db.session.commit()
                return {"status": "success", "message": "Stanje je postavljeno na neutralno."}
            else:
                # Ako nema postojeći zapis, stanje je već neutralno
                return {"status": "success", "message": "Stanje je već neutralno."}
        else:
            if existing_like:
                # Ažuriraj postojeći zapis
                existing_like.is_like = is_like
                db.session.commit()
                action = "lajkovano" if is_like else "dislajkovano"
                return {"status": "success", "message": f"Diskusija je {action}."}
            else:
                # Kreiraj novi zapis za lajk ili dislajk
                new_like = Like(user_id=user_id, discussion_id=discussion_id, is_like=is_like)
                db.session.add(new_like)
                db.session.commit()
                action = "lajkovano" if is_like else "dislajkovano"
                return {"status": "success", "message": f"Diskusija je {action}."}
    except Exception as e:
        # Rollback u slučaju greške
        db.session.rollback()
        print(f"Greška prilikom postavljanja stanja: {str(e)}")
        return {"status": "error", "message": f"Greška: {str(e)}"}