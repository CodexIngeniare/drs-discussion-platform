from app import create_app, db

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Kreira tabele ako ne postoje
    app.run(debug=True)
