import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from django.db import connections
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.conf import settings


class Command(BaseCommand):
    help = "Check if the database exists, create it if necessary"

    def handle(self, *args, **kwargs):
        db_name = settings.DATABASES['default']['NAME']

        # Check and create database
        self.stdout.write("Checking if the database exists...")
        if not self.database_exists(db_name):
            self.stdout.write(f"Database {db_name} does not exist. Creating it...")
            self.create_database(db_name)
        else:
            self.stdout.write(f"Database {db_name} exists.")

        # Check and create postgres_fdw extension
        self.stdout.write("Checking if the 'timescaledb' extension exists...")
        with connections['default'].cursor() as cursor:
            self.check_and_create_timescaledb_extension(cursor)

    def database_exists(self, db_name):
        """Check if the database exists"""
        db_user = settings.DATABASES['default']['USER']
        db_password = settings.DATABASES['default']['PASSWORD']
        db_host = settings.DATABASES['default']['HOST']
        db_port = settings.DATABASES['default']['PORT']

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
        db_user = settings.DATABASES['default']['USER']
        db_password = settings.DATABASES['default']['PASSWORD']
        db_host = settings.DATABASES['default']['HOST']
        db_port = settings.DATABASES['default']['PORT']

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

    def check_and_create_timescaledb_extension(self, cursor):
        """Check if the 'timescaledb' extension exists and create it if necessary."""
        cursor.execute("SELECT 1 FROM pg_extension WHERE extname = 'timescaledb';")
        extension_exists = cursor.fetchone()
        if not extension_exists:
            cursor.execute("CREATE EXTENSION IF NOT EXISTS timescaledb;")
            self.stdout.write("Created the 'timescaledb' extension.")
