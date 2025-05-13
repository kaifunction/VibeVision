from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Comment(db.Model):
     __tablename__ = 'comments'

     if environment == "production":
          __table_args__ = {'schema': SCHEMA}

     id = db.Column(db.Integer, primary_key=True)
     comment = db.Column(db.Text, nullable=False)
     user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
     pin_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('pins.id')), nullable=False)
     created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
     updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())


     pin = db.relationship(
          'Pin',
          back_populates='comments'
     )

     user = db.relationship(
          'User',
          back_populates='comments',
          # cascade="all, delete"
     )

     #下面的comment_dict中要使用的名称也 比如user， pin。 变量名出就是与其它table建立连接的桥梁，正如上面使用的pin 和 user的变量名字。
     def comment_dict(self):
          return {
               'id': self.id,
               'comment': self.comment,
               'user': self.user.to_dict(),
               'pin_id': self.pin_id,
               'created_at': self.created_at,
               'updated_at': self.updated_at
          }
