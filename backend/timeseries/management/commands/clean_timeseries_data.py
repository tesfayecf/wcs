from django.core.management.base import BaseCommand
from utils.db_utils import truncate_tables

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
        truncate_tables(tables_to_truncate)

        self.stdout.write(self.style.SUCCESS("Successfully cleaned all timeseries data."))