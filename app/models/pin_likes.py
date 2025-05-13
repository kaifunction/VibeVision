from .db import db, environment, SCHEMA, add_prefix_for_prod


pin_likes = db.Table(
    'pin_likes',
    db.Column(
         'user_id',
         db.Integer,
         db.ForeignKey(add_prefix_for_prod("users.id")),
         primary_key=True
     ),
    db.Column(
         'pin_id',
         db.Integer,
         db.ForeignKey(add_prefix_for_prod("pins.id")),
         primary_key=True
     )
)

if environment == 'production':
     pin_likes.schema = SCHEMA
