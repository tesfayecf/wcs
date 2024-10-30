from django.core.management.base import BaseCommand
from utils.db_utils import truncate_tables

class Command(BaseCommand):
    help = "Clean all dummy data by truncating relevant tables."

    def handle(self, *args, **kwargs):
        # List of tables to truncate for dummy data
        tables_to_truncate = [
            'resources_group',  # Table for groups
            'resources_tank',   # Table for tanks
            'resources_sensor', # Table for sensors
        ]

        # Clean the dummy data
        truncate_tables(tables_to_truncate)

        self.stdout.write(self.style.SUCCESS("Successfully cleaned all dummy data."))