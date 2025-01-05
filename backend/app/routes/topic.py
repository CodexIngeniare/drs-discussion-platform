from flask import Blueprint, request, jsonify
from app.services.auth import session_handler
from app.services.database.topic_queries import create_topic, update_topic, get_topic_by_id, get_all_topics,delete_topic,get_topic_by_name

# Definicija Blueprint-a za topic rute
topic_bp = Blueprint('topic', __name__)

@topic_bp.route('/create_topic', methods=['POST'])
def create_topic_route():
    """
    Kreira novu temu.
    Proverava da li korisnik ima admin privilegije pre kreiranja teme.
    """
    try:
        # Dohvati token iz zaglavlja zahteva
        user_token = request.headers.get('Authorization')
        if not user_token:
            return jsonify({"error_code": "MISSING_TOKEN", "message": "Token is required."}), 400

        # Obradi "Bearer" prefiks ako postoji
        if user_token.startswith("Bearer "):
            user_token = user_token[len("Bearer "):]

        # Validacija tokena
        session_data = session_handler.get_session(user_token)
        if not session_data:
            return jsonify({"error_code": "UNAUTHORIZED", "message": "Invalid or expired token."}), 401

        # Provera administratorskih privilegija
        email = session_data.get("email")
        permissions = session_data.get("permissions")
        if not email or permissions != "admin":
            return jsonify({"error_code": "FORBIDDEN", "message": "Admin privileges required."}), 403

        # Parsiranje ulaznih podataka
        data = request.get_json()
        if not data or "name" not in data:
            return jsonify({"error_code": "INVALID_DATA", "message": "Name is required."}), 400

        name = data["name"]
        description = data.get("description")

        # Provera da li tema sa istim imenom već postoji
        existing_topic = get_topic_by_name(name)
        if existing_topic:
            return jsonify({"error_code": "CONFLICT", "message": "Topic with this name already exists."}),409

        # Kreiranje teme
        new_topic = create_topic(name, description)
        if not new_topic:
            return jsonify({"error_code": "CREATION_FAILED", "message": "Topic creation failed."}), 500

        # Uspešan odgovor
        return jsonify({
            "message": "Topic created successfully",
            "topic": {
                "id": new_topic.id,
                "name": new_topic.name,
                "description": new_topic.description,
                "created_at": new_topic.created_at,
                "updated_at": new_topic.updated_at
            }
        }), 201

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500
    


@topic_bp.route('/update_topic', methods=['PUT'])
def update_topic_route():
    """
    Ažurira postojeću temu.
    Proverava da li korisnik ima admin privilegije pre ažuriranja teme.
    """
    try:
        # Dohvati token iz zaglavlja zahteva
        user_token = request.headers.get('Authorization')
        if not user_token:
            return jsonify({"error_code": "MISSING_TOKEN", "message": "Token is required."}), 400

        # Obradi "Bearer" prefiks ako postoji
        if user_token.startswith("Bearer "):
            user_token = user_token[len("Bearer "):]

        # Validacija tokena
        session_data = session_handler.get_session(user_token)
        if not session_data:
            return jsonify({"error_code": "UNAUTHORIZED", "message": "Invalid or expired token."}), 401

        # Provera administratorskih privilegija
        permissions = session_data.get("permissions")
        if permissions != "admin":
            return jsonify({"error_code": "FORBIDDEN", "message": "Admin privileges required."}), 403

        # Parsiranje ulaznih podataka
        data = request.get_json()
        if not data or "topic_id" not in data:
            return jsonify({"error_code": "INVALID_DATA", "message": "Topic ID is required."}), 400

        topic_id = data["topic_id"]
        name = data.get("name")
        description = data.get("description")

        # Dohvatanje teme iz baze
        topic = get_topic_by_id(topic_id)
        if not topic:
            return jsonify({"error_code": "NOT_FOUND", "message": "Topic not found."}), 404

        # Ažuriranje teme
        updated_topic = update_topic(topic_id, name, description)
        if not updated_topic:
            return jsonify({"error_code": "UPDATE_FAILED", "message": "Failed to update the topic."}), 500

        # Uspešan odgovor sa svim poljima
        return jsonify({
            "message": "Topic updated successfully",
            "topic": {
                "id": updated_topic.id,
                "name": updated_topic.name,
                "description": updated_topic.description,
                "created_at": updated_topic.created_at,
                "updated_at": updated_topic.updated_at
            }
        }), 200

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500
    

@topic_bp.route('/get_all_topics', methods=['GET'])
def get_all_topics_route():
    """
    Dohvata sve teme iz baze podataka.
    """
    try:
        # Dohvatanje svih tema iz baze
        topics = get_all_topics()
        if not topics:
            return jsonify({"error_code": "NOT_FOUND", "message": "No topics found."}), 404

        # Pripremanje liste tema za odgovor
        topics_data = [
            {
                "id": topic.id,
                "name": topic.name,
                "description": topic.description,
                "created_at": topic.created_at,
                "updated_at": topic.updated_at
            }
            for topic in topics
        ]

        # Uspešan odgovor sa svim temama
        return jsonify({
            "message": "All topics fetched successfully",
            "topics": topics_data
        }), 200

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500
    

@topic_bp.route('/delete_topic', methods=['DELETE'])
def delete_topic_route():
    """
    Briše temu iz baze.
    Proverava da li korisnik ima admin privilegije pre brisanja teme.
    """
    try:
        # Dohvati token iz zaglavlja zahteva
        user_token = request.headers.get('Authorization')
        if not user_token:
            return jsonify({"error_code": "MISSING_TOKEN", "message": "Token is required."}), 400

        # Obradi "Bearer" prefiks ako postoji
        if user_token.startswith("Bearer "):
            user_token = user_token[len("Bearer "):]

        # Validacija tokena
        session_data = session_handler.get_session(user_token)
        if not session_data:
            return jsonify({"error_code": "UNAUTHORIZED", "message": "Invalid or expired token."}), 401

        # Provera administratorskih privilegija
        permissions = session_data.get("permissions")
        if permissions != "admin":
            return jsonify({"error_code": "FORBIDDEN", "message": "Admin privileges required."}), 403

        # Parsiranje ulaznih podataka
        data = request.get_json()
        if not data or "topic_id" not in data:
            return jsonify({"error_code": "INVALID_DATA", "message": "Topic ID is required."}), 400

        topic_id = data["topic_id"]

        # Dohvatanje teme iz baze
        topic = get_topic_by_id(topic_id)
        if not topic:
            return jsonify({"error_code": "NOT_FOUND", "message": "Topic not found."}), 404

        # Brisanje teme
        success = delete_topic(topic_id)
        if not success:
            return jsonify({"error_code": "DELETE_FAILED", "message": "Failed to delete the topic."}), 500

        # Uspešan odgovor
        return jsonify({"message": "Topic deleted successfully."}), 200

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500