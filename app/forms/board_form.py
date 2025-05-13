from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError
from datetime import datetime as dt
from ..s3_helpers import ALLOWED_EXTENSIONS
from flask_wtf.file import FileField, FileAllowed, FileRequired


# def is_before_today(_form, field):
#     if not field:
#         return
#     if (dt.strptime(field.data, "%Y-%m-%d") - dt.now()).total_seconds() > 0:
#         raise ValidationError("Date must be before today.")


class BoardForm(FlaskForm):
     title = StringField('title', validators=[DataRequired(message='Title is required')])
     board_pic = FileField('board_pic', validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
     description = StringField('description')
     pins = StringField('pins')
    #  created_at = StringField('created_at', validators=[is_before_today])
