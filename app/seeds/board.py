from app.models import db, Board, environment, SCHEMA
from sqlalchemy.sql import text


def board_seed_data(all_pins, all_users):
     board1 = Board(title='Posters', board_pic='https://vibevision-project.s3.us-west-1.amazonaws.com/poster1.jpeg', description='Bold and vibrant posters that captivate with dynamic visual storytelling.', user_id=1)
     board1.pins.extend(all_pins[0:9] + all_pins[39:49])
     board2 = Board(title='Illustrations', board_pic='https://vibevision-project.s3.us-west-1.amazonaws.com/Illustration1.jpeg', description='Whimsical illustrations bring imagination to life with intricate detailing.', user_id=2)
     board2.pins.extend(all_pins[9:19] + all_pins[49:59])
     board3 = Board(title='Photography', board_pic='https://vibevision-project.s3.us-west-1.amazonaws.com/Photography1.jpeg', description='Stunning photography captures moments, revealing beauty in everyday scenes.', user_id=3)
     board3.pins.extend(all_pins[19:29] + all_pins[59:69])
     board4 = Board(title='Graphic Design', board_pic='https://vibevision-project.s3.us-west-1.amazonaws.com/GD1.jpeg', description='Innovative graphic designs seamlessly blend form and function for effective communication.', user_id=4)
     board4.pins.extend(all_pins[29:39] + all_pins[69:79])


     all_boards = [board1, board2, board3, board4]

     db.session.add_all(all_boards)
     db.session.commit()

def undo_board_seeds():
     if environment == 'production':
          db.session.execute(f"TRUNCATE table {SCHEMA}.boards RESTART IDENTITY CASCADE;")
          db.session.execute(f"TRUNCATE table {SCHEMA}.board_pins RESTART IDENTITY CASCADE;")
     else:
          db.session.execute(text("DELETE FROM boards"))
          db.session.execute(text("DELETE FROM board_pins"))
     db.session.commit()
