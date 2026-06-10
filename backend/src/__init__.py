from flask import Flask
from .settings.config import Config
from .settings.extensions import db, migrate, cors

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, supports_credentials=True, origins=["http://localhost:3000"])

    try:
        from .routes import register_routes
        from src.routes.word_route import word_bp
        register_routes(app)
        app.register_blueprint(word_bp)
    

        from src.models.word_model import Word

    
    except Exception:
        pass

    return app
