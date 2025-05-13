from flask_wtf import FlaskForm
from wtforms import StringField, FileField, TextAreaField, SubmitField

class PinBoardForm(FlaskForm):
     title = StringField('Title')
     pin_link = FileField('pin_link')
     description = TextAreaField('Description')
     submit = SubmitField("Create Board")
