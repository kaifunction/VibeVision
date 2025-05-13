from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Board(db.Model):
     __tablename__ = 'boards'

     if environment == "production":
          __table_args__ = {'schema': SCHEMA}


     id = db.Column(db.Integer, primary_key=True)
     title = db.Column(db.String(255), nullable=False)
     board_pic = db.Column(db.String(255))
     description = db.Column(db.Text)
     user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
     pin_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('pins.id')))
     created_at = db.Column(db.DateTime, default=datetime.utcnow())
     updated_at = db.Column(db.DateTime, default=datetime.utcnow())


     def to_dict(self):
          return {
               "id": self.id,
               "title": self.title,
               "board_pic": self.board_pic,
               "description": self.description,
               "user": self.user.toDictLimited(),
               "pins": [pin.toDictLimited() for pin in self.pins],
               "created_at": self.created_at,
               "updated_at": self.updated_at
          }

     def toDictLimited(self):
          return {
               'id':self.id,
               'title':self.title,
               'board_pic':self.board_pic,
               'user':self.user.toDictBoard(),
               'pins':[pin.toDictLimited() for pin in self.pins]
          }

     def board_dict(self):
          return {
               'id':self.id,
               'title':self.title,
               'board_pic':self.board_pic,
               'description':self.description,
               'user_id':self.user_id,
               "created_at":self.created_at,
               "updated_at":self.updated_at,
          }

     user = db.relationship(
          'User',
          back_populates='boards'
     )

     pins = db.relationship(
          'Pin',
          secondary='board_pins',
          back_populates='boards',
          cascade="all, delete"
     )
