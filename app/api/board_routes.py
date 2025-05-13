from flask import Blueprint, jsonify, request, render_template
from flask_login import login_required, current_user
from app.models import db, Board, User, Pin
from app.forms import BoardForm, PinForm, PinBoardForm
from datetime import datetime as dt
from app.s3_helpers import upload_file_to_s3, remove_file_from_s3, get_unique_filename


board_routes = Blueprint('boards', __name__)

# GET all boards
@board_routes.route('/')
def all_board():
     boards = Board.query.all()
     # print('BOARDS:================> ', boards)
     return {
          'boards': [board.toDictLimited() for board in boards]
     }


# GET a single board
@board_routes.route('/<int:id>/')
def get_board(id):
    board = Board.query.get(id)
    return {
        "board": board.to_dict()
    }


# POST a new board
@board_routes.route('/board-creation-tool/', methods=['POST'])
@login_required
def create_board():

     form = BoardForm()
     form['csrf_token'].data = request.cookies['csrf_token']
     if form.validate_on_submit():
          # pinStr = form.data['pins']
          # pins = []
          # for pinId in pinStr.split(','):
          #      pins.append(Pin.query.get(pinId))

          # board = Board(
          #      title=form.data['title'],
          #      board_pic=form.data['board_pic'],
          #      description=form.data['description'],
          #      user=user,
          #      # pins=pins,
          #      # created_at=dt.now(),
          #      # updated_at=dt.now()
          # )
          board_pic = form.data['board_pic']
          board_pic.filename = get_unique_filename(board_pic.filename)
          upload = upload_file_to_s3(board_pic)

          if 'url' not in upload:
               return render_template('error.html', message='Failed to upload image to S3')
          url = ''
          if upload:
               url = upload['url']
          new_board = Board(
               user=current_user,
               title=form.data['title'],
               board_pic=url,
               description=form.data['description']
          )
          db.session.add(new_board)
          db.session.commit()
          return { 'board': new_board.to_dict() }, 200
     return {'errors': form.errors}, 401


# Post a pin to a board by board id
@board_routes.route('/<int:id>/add-pin/', methods=['POST'])
@login_required
def add_pin_to_board(id):
     board = Board.query.get(id)
     # print('BOARD:================> ', board) 正确✅
     if not board:
          return {'errors': 'Board not found'}, 404

     form = PinBoardForm()
     form['csrf_token'].data = request.cookies['csrf_token']
     print("FORM DATA FROM BOARD CREATE A PIN ROUTE===>", form.data)

     if form.validate_on_submit():

          # pin_data = form.data['pin']


          # pinStr = form.data['pins']
          # pins = []
          # for pinId in pinStr.split(','):
          #      pins.append(Pin.query.get(pinId))

          pin = Pin(
               title=form.data['title'],
               description=form.data['description'],
               pin_link=form.data['pin_link'],
               user = current_user,
          )
          board.pins.append(pin)

          db.session.commit()
          return { 'board': board.to_dict() }, 200
     return {'errors': form.errors}, 401


# Edit a board
@board_routes.route('/<int:id>/edit/', methods=['POST'])
@login_required
def edit_board(id):
     # user = User.query.get(current_user.id)
     board = Board.query.get(id)

     # if user.id != board.user.id:
     #      return { 'message': 'Forbidden.' }, 403
     if not board:
          return { 'message': 'Board not found.' }, 404


     updated_board = BoardForm()
     updated_board['csrf_token'].data = request.cookies['csrf_token']
     #=======> <========#
     print('updated pin is: ', updated_board)
     if updated_board.validate_on_submit():
          board_pic = updated_board.data['board_pic']
          board_pic.filename = get_unique_filename(board_pic.filename)
          upload = upload_file_to_s3(board_pic)

          if 'url' not in upload:
               return render_template('error.html', message='Failed to upload image to S3')
          url = ''
          if upload:
               url = upload['url']

          board.title = updated_board.data['title']
          board.board_pic = url
          board.description = updated_board.data['description']

          db.session.commit()
          return { 'board': board.to_dict() }, 200
     return {'errors': updated_board.errors}, 401



# Delete a board
@board_routes.route('/<int:id>/', methods=['DELETE'])
@login_required
def delete_board(id):
     user = User.query.get(current_user.id)
     board = Board.query.get(id)

     if user.id != board.user.id:
          return { 'message': 'Forbidden.' }, 403

     if board.board_pic:
          remove_file_from_s3(board.board_pic)

     for pin in board.pins:
          if board.board_pic:
               remove_file_from_s3(pin.pin_link)
          remove_file_from_s3(pin.pin_link)


     db.session.delete(board)
     db.session.commit()
     return { 'message': 'Board deleted.' }, 200
