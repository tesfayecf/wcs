from django.core.management.base import BaseCommand
from backend.utils.db_utils import truncate_tables

class Command(BaseCommand):
    help = "Clean all user data by truncating relevant tables."

    def handle(self, *args, **kwargs):
        # List of user-related tables to truncate
        tables_to_truncate = [
            'auth_user',  # Django's user table
            'auth_group',  # Django's group table
            'auth_user_groups',  # Table linking users to groups
            'auth_permission',  # Django's permission table
            # Add any other user-related tables if necessary
        ]

        # Clean the user data
        truncate_tables(tables_to_truncate)

        self.stdout.write(self.style.SUCCESS("Successfully cleaned all user data."))