from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = "Clean all timeseries data by truncating relevant tables."

    def handle(self, *args, **kwargs):
        # List of timeseries tables to truncate
        tables_to_truncate = [
            'timeseries_measure',   # Table for measures
            'timeseries_channel',   # Table for channels
            'timeseries_chunk',     # Table for chunks
            'timeseries_record',    # Table for records
        ]

        # Clean the timeseries data
        with connection.cursor() as cursor:
            for table in tables_to_truncate:
                cursor.execute(f'TRUNCATE TABLE {table} CASCADE;')

        self.stdout.write(self.style.SUCCESS("Successfully cleaned all timeseries data."))