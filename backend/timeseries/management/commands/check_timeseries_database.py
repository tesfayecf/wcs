import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from django.db import connections
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.conf import settings


class Command(BaseCommand):
    help = "Check if the 'timeseries_database' exists, create it if necessary, and activate TimescaleDB"

    def handle(self, *args, **kwargs):
        timeseries_db_name = settings.DATABASES['timeseries']['NAME']

        # Check and create dev_timeseries
        self.stdout.write("Checking if the 'dev_timeseries' exists...")
        if not self.database_exists(timeseries_db_name):
            self.stdout.write(f"Database {timeseries_db_name} does not exist. Creating it...")
            self.create_database(timeseries_db_name)
        else:
            self.stdout.write(f"Database {timeseries_db_name} exists.")

        # Activate TimescaleDB extension in dev_timeseries
        self.stdout.write("Activating TimescaleDB extension in 'dev_timeseries'...")
        self.activate_timescaledb_extension(timeseries_db_name)

    def database_exists(self, db_name):
        """Check if the database exists"""
        db_user = settings.DATABASES['timeseries']['USER']
        db_password = settings.DATABASES['timeseries']['PASSWORD']
        db_host = settings.DATABASES['timeseries']['HOST']
        db_port = settings.DATABASES['timeseries']['PORT']

        try:
            conn = psycopg2.connect(
                dbname="postgres", user=db_user, password=db_password, host=db_host, port=db_port
            )
            conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            cursor = conn.cursor()
            cursor.execute(f"SELECT 1 FROM pg_database WHERE datname='{db_name}';")
            exists = cursor.fetchone()
            cursor.close()
            conn.close()
            return exists is not None
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error checking database existence: {e}"))
            return False

    def create_database(self, db_name):
        """Create the database if it doesn't exist"""
        db_user = settings.DATABASES['timeseries']['USER']
        db_password = settings.DATABASES['timeseries']['PASSWORD']
        db_host = settings.DATABASES['timeseries']['HOST']
        db_port = settings.DATABASES['timeseries']['PORT']

        try:
            conn = psycopg2.connect(
                dbname="postgres", user=db_user, password=db_password, host=db_host, port=db_port
            )
            conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            cursor = conn.cursor()
            cursor.execute(f"CREATE DATABASE {db_name};")
            cursor.close()
            conn.close()
            self.stdout.write(self.style.SUCCESS(f"Database {db_name} created successfully."))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error creating database: {e}"))