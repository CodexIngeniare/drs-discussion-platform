from .config import Config

class DevelopmentConfig(Config):
    DEBUG = True

    # TODO: implementirati ucitavanje konfiguracije iz .env fajla