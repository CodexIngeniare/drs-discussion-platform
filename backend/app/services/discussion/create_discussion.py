from app.services.database.discussions_queries import create_discussion  # Import funkcije iz database foldera

def create_discussion_service(title, content, user_id, topic_id):
    """
    Servisna funkcija koja poziva funkciju za rad sa bazom podataka i kreira diskusiju.
    """
    try:
        # Pozivanje funkcije iz database foldera za kreiranje diskusije
        new_discussion = create_discussion(title, content, user_id, topic_id)
        return new_discussion
    except Exception as e:
        print(f"Greška prilikom kreiranja diskusije: {str(e)}")
        return None