from flask_wtf import FlaskForm
from wtforms import StringField, FileField, TextAreaField, SubmitField
from wtforms.validators import DataRequired
from ..s3_helpers import ALLOWED_EXTENSIONS
from flask_wtf.file import FileField, FileAllowed, FileRequired

class PinForm(FlaskForm):
     title = StringField('Title', validators=[DataRequired(message='Title is required')])
     pin_link = FileField('pin_link', validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
     description = TextAreaField('Description')
     # pin = FileField("Pin File", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
     submit = SubmitField("Create Post")
