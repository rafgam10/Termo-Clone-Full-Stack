from sqlalchemy import Column, String, Integer

from src.settings.extensions import db

class Word(db.Model):
    
    __tablename__ = "words"
    
    id = Column(Integer, primary_key=True)
    word = Column(String(6), nullable=False)