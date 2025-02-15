from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = "Clean all dummy data by truncating relevant tables."

    def handle(self, *args, **kwargs):
        # List of tables to truncate for dummy data
        tables_to_truncate = [
            'resources_group',  # Table for groups
            'resources_tank',   # Table for tanks
            'resources_sensor', # Table for sensors
        ]

        # Clean the resources data
        with connection.cursor() as cursor:
            for table in tables_to_truncate:
                try:
                    cursor.execute(f'TRUNCATE TABLE {table} CASCADE;')
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Error truncating table {table}: {e}"))

        self.stdout.write(self.style.SUCCESS("Successfully cleaned all dummy data."))