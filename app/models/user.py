from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(40))
    last_name = db.Column(db.String(40))
    profile_pic = db.Column(db.String(255))
    personal = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)



    def toDictBoard(self):
        return {
            'id': self.id,
            'username': self.username
        }


    def toDictLimited(self):
        return {
            'id': self.id,
            'username': self.username,
            'pins': [pin.toDictLimited() for pin in self.pins],
            'boards': [board.toDictLimited() for board in self.boards]
        }

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }

    def public_user_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'username': self.username,
            'email': self.email,
            'profile_pic': self.profile_pic,
            'personal': self.personal,
            'created_at': self.created_at
        }

    pins = db.relationship(
        "Pin",
        back_populates="user",
        cascade="all, delete"
    )


    comments = db.relationship(
        "Comment",
        back_populates="user",
        cascade="all, delete"
    )


    boards = db.relationship(
        "Board",
        back_populates="user",
        cascade="all, delete"
    )


    user_liked_pins = db.relationship(
        "Pin",
        secondary="pin_likes",
        back_populates="likes"
    )
