from flask.cli import AppGroup
from .users import seed_users, undo_users
from .pins import pin_seed_data, undo_pin_seeds
from .comment import comment_seed_data, undo_comment_seeds
from .board import board_seed_data, undo_board_seeds

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
    all_users = seed_users()
    all_pins = pin_seed_data(all_users)
    board_seed_data(all_pins, all_users)
    # pin_seed_data(all_users)
    comment_seed_data(all_users, all_pins)
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_comment_seeds()
    undo_board_seeds()
    undo_pin_seeds()
    undo_users()
    # Add other undo functions here
