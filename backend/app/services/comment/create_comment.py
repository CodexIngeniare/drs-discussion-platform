from app.services.database.comments_queries import create_comment  # Import funkcije iz database foldera

def create_comment_service(discussion_id, user_id, content):
    """
    Servisna funkcija koja poziva funkciju za rad sa bazom podataka i kreira komentar.
    """
    try:
        # Pozivanje funkcije iz database foldera za kreiranje komentara
        new_comment = create_comment(discussion_id, user_id, content)
        return new_comment
    except Exception as e:
        print(f"Greška prilikom kreiranja komentara: {str(e)}")
        return None