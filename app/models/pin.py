from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Pin(db.Model):
     __tablename__ = 'pins'

     if environment == "production":
        __table_args__ = {'schema': SCHEMA}

     id = db.Column(db.Integer, primary_key=True)
     title = db.Column(db.String(255), nullable=False)
     pin_link = db.Column(db.String(255), nullable=False)
     description = db.Column(db.Text)
     user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
     created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
     # favorites = db.Column(db.Integer)
     # board_id = db.Column(db.Integer)



     def toDictHomePage(self):
          return {
               'id': self.id,
               'title': self.title,
               'pin_link': self.pin_link,
          }

     def toDictLimited(self):
         return {
               'id': self.id,
               'title': self.title,
               'description': self.description,
               'user': self.user.public_user_dict(),
               'user_id': self.user_id,
               'pin_link': self.pin_link,
               'likes': len(self.likes),
         }


     def pin_dict(self):
          return{
               'id': self.id,
               'title': self.title,
               'pin_link': self.pin_link,
               'description': self.description,
               'user_id': self.user_id,
               'created_at': self.created_at,
               'user': self.user.public_user_dict(),
               'comments': [comment.comment_dict() for comment in self.comments],
               'boards':[board.board_dict() for board in self.boards],
               'likes': len(self.likes),
          }

     boards = db.relationship(
          'Board',
          secondary='board_pins',
          back_populates='pins'
     )

     likes = db.relationship(
          'User',
          secondary='pin_likes',
          back_populates='user_liked_pins'
     )


     #下面的 变量名出就是与其它table建立连接的桥梁，也是在上面的pin_dict中要使用的名称 比如user， comments。
     user = db.relationship(
          "User",
          back_populates="pins"
     )

     comments = db.relationship(
          'Comment',
          back_populates='pin',
          cascade="all, delete"
     )
