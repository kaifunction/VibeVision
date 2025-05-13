from flask import Blueprint, request, render_template, jsonify
from app.models import db, User, Pin, Comment
from flask_login import login_required, current_user
from datetime import datetime
from app.s3_helpers import upload_file_to_s3, remove_file_from_s3, get_unique_filename
from app.forms import PinForm, CommentForm


pin_routes = Blueprint('pin', __name__)


# def create_pin(pinForm):
#      pin = pinForm.data['pin']

#      pin.filename = get_unique_filename(pin.filename)
#      upload_pin = upload_file_to_s3(pin)
#      print(upload_pin)

#      upload_pic = {"url": "No Image"}

#      pin_pic = pinForm.data['pin_pic']
#      if pin_pic:
#           pin_pic.filename = get_unique_filename(pin_pic.filename)
#           upload_pic = upload_file_to_s3(pin_pic)

#      user = User.query.get(current_user.id)
#      new_pin = Pin(
#           user = user,
#           title = pinForm.data['title'],
#           description = pinForm.data['description'],
#           user_id = current_user.id,
#           pin_link = upload_pin['url']
#      )

#      db.session.add(new_pin)
#      db.session.commit()
#      return new_pin


#Get all pins routes
@pin_routes.route('/')
def pins():
     pins = Pin.query.all()
     # print(pins)
     # return pins.pin_dict()
     return {pin.id:pin.pin_dict() for pin in pins}


#Get a single pin routes
@pin_routes.route('/<int:id>/')
def single_pin(id):
     pin = Pin.query.get(id)

     return pin.pin_dict()


#Create a pin
@pin_routes.route('/pin-creation-tool/', methods=['POST'])
@login_required
def create_pin_route():
     form = PinForm()
     form['csrf_token'].data = request.cookies['csrf_token']

     print("FORM DATA FROM PIN ROUTE===>", form.data)
     if form.validate_on_submit():
          pin_link = form.data['pin_link']
          pin_link.filename = get_unique_filename(pin_link.filename)
          upload = upload_file_to_s3(pin_link)
          print("================>", upload)

          if 'url' not in upload:
               return render_template("post_form.html", form=form, errors=[upload])
          url = ''
          if upload:
               url = upload['url']
          new_pin = Pin(
               user=current_user,
               title=form.data['title'],
               pin_link=url,
               description=form.data['description']
          )
          db.session.add(new_pin)
          db.session.commit()

          return jsonify(new_pin.pin_dict()), 201

     return jsonify({'errors': form.errors}), 400


#Edit a pin by pin id
@pin_routes.route('/<int:id>/edit/', methods=["POST"])
@login_required
def updata_pin(id):
     pin = Pin.query.get(id)

     if not pin:
          return {'errors': 'Pin not found'}, 404

     updated_pin = PinForm()
     updated_pin['csrf_token'].data = request.cookies['csrf_token']
     #=======> <========#
     print('updated pin is: ', updated_pin)
     if updated_pin.validate_on_submit():
          pin_link = updated_pin.data['pin_link']
          pin_link.filename = get_unique_filename(pin_link.filename)
          upload = upload_file_to_s3(pin_link)

          if 'url' not in upload:
               return render_template("post_form.html", form=updated_pin, errors=[upload])
          url = ''
          if upload:
               url = upload['url']

          pin.title = updated_pin.data['title']
          pin.pin_link = url
          pin.description = updated_pin.data['description']
          # new_pin = Pin(
          #      user=current_user,
          #      title=updated_pin.data['title'],
          #      pin_link=url,
          #      description=updated_pin.data['description']
          # )

     # if updated_pin.validate_on_submit():
     #      pin.title = updated_pin.title.data
     #      pin.description = updated_pin.description.data
     #      pin.pin_link = updated_pin.pin_link.data

          # db.session.add(new_pin)
          db.session.commit()

          return jsonify(pin.pin_dict()), 201
     return jsonify({'errors': updated_pin.errors}), 403


#Delete a pin by id
@pin_routes.route('/<int:id>', methods=['DELETE'])
# @login_required
def delete_pin(id):
     pin = Pin.query.get(id)

     if not pin:
          return {'errors': 'Pin not found'}, 404

     remove_file_from_s3(pin.pin_link)

     db.session.delete(pin)
     db.session.commit()


     return {'Message': 'Successfully Deleted'}


# Commnets routes
# Post a comment by pin Id
@pin_routes.route('/<int:id>/comments/', methods=['POST'])
@login_required
def post_pin_comment(id):
     print('ID=================>', id)

     form = CommentForm()
     form['csrf_token'].data = request.cookies['csrf_token']

     if form.validate_on_submit():
          comment = Comment(
               comment = form.data['comment'],
               user_id = current_user.id,
               pin_id = id,
               created_at = datetime.utcnow(),
               updated_at = datetime.utcnow()
          )
          if comment.comment is not None:
               db.session.add(comment)
               db.session.commit()
               return comment.comment_dict()
          else:
               return {'Errors': 'Unable to create commnet.'}
     else:
          return jsonify({'Errors': 'Form validation failed.'})


# Edit a comment
@pin_routes.route('/<int:_id>/comments/<int:c_id>/', methods=['POST'])
@login_required
def edit_pin_comment(_id, c_id):
     comment = Comment.query.get(c_id)
     # print("COMMENT ID FROM PIN ROUTE======>", comment.comment_dict())
     form = CommentForm()
     form['csrf_token'].data = request.cookies['csrf_token']
     # print("COMMENTFORM FROM PIN ROUTE======>", form)
     # print("REQUEST JSON FROM PIN ROUTE======>", request.json)

     if form.validate_on_submit() and comment.user_id == current_user.id:
          # comment.comment = form.data['comment']
          # comment.updated_at = datetime.utcnow()
          # print("AFTER COMMENT ID FROM PIN ROUTE======>", comment.comment_dict())
          # db.session.add(comment)

          data = request.json
          edited_comment = data.get('comment')
          # print("EDITED_COMMENT FROM PIN ROUTE======>", edited_comment)
          comment.comment = edited_comment
          comment.updated_at = datetime.utcnow()

          db.session.commit()
          return comment.comment_dict()
     else:
          #============>这个print很重要 <=============#
          # print("FORM VALIDATION ERRORS:", form.errors)
          return {'Error': 'Could not edit comment.'}



# Delete a comment from the pin
@pin_routes.route('/<int:_id>/comments/<int:c_id>/', methods=['DELETE'])
@login_required
def delete_pin_comment(_id, c_id):
     comment = Comment.query.get(c_id)
     # print("COMMENT ID FROM PIN ROUTE======>", comment.comment_dict())
     if not comment:
          return {'Error': 'Cannot find comment'}
     db.session.delete(comment)
     db.session.commit()
     return {'message': 'Deleted successful'}




@pin_routes.route('/search', methods=['GET'])
def search_pins():
     query = request.args.get('query')
     print('QUERY=======>', query)
     if not query:
          return {'errors': 'No search query provided'}, 400

     pins = Pin.query.filter(Pin.title.ilike(f'%{query}%')).all()

     return {pin.id:pin.pin_dict() for pin in pins}


# Add a like to a pin
@pin_routes.route('/<int:id>/like/', methods=['POST', 'DELETE'])
@login_required
def add_like(id):
     found = False
     pin = Pin.query.get(id)
     for user in pin.likes:
          if user.id == current_user.id:
               pin.likes.remove(user)
               found = True
               break
     if not found:
          pin.likes.append(current_user)
     db.session.add(pin)
     db.session.commit()
     return {"message": "deleted like" if found else "added like"}, 202 if found else 200
