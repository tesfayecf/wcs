from django.core.management.base import BaseCommand
from backend.utils.db_utils import truncate_tables

class Command(BaseCommand):
    help = "Clean all dummy data by truncating relevant tables."

    def handle(self, *args, **kwargs):
        # List of tables to truncate for dummy data
        tables_to_truncate = [
            'data_group',  # Table for groups
            'data_tank',   # Table for tanks
            'data_sensor',  # Table for sensors
            # Add any other tables related to dummy data if necessary
        ]

        # Clean the dummy data
        truncate_tables(tables_to_truncate)

        self.stdout.write(self.style.SUCCESS("Successfully cleaned all dummy data."))