from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = "Clean all user data by truncating relevant tables."

    def handle(self, *args, **kwargs):
        # List of user-related tables to truncate
        tables_to_truncate = [
            'users_user',                   # Django's user table
            'users_user_groups',            # Table linking users to groups
            'users_user_userpermission',    # Django's permission table
        ]

        # Clean the users data
        with connection.cursor() as cursor:
            for table in tables_to_truncate:
                cursor.execute(f'TRUNCATE TABLE {table} CASCADE;')

        self.stdout.write(self.style.SUCCESS("Successfully cleaned all user data."))