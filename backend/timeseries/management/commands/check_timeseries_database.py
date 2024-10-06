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

        # Check and create postgres_fdw extension
        self.stdout.write("Checking if the 'postgres_fdw' extension exists...")
        with connections['timeseries'].cursor() as cursor:
            self.check_and_create_postgres_fdw_extension(cursor)

        # Check and create timescaledb extension
        self.stdout.write("Checking if the 'timescaledb' extension exists...")
        with connections['timeseries'].cursor() as cursor:
            self.check_and_create_timescaledb_extension(cursor)
        
        # Create the 'data_db_server' foreign server if it doesn't exist
        self.stdout.write("Creating the 'data_db_server' foreign server if it doesn't exist...")
        with connections['timeseries'].cursor() as cursor:
            self.create_foreign_server(cursor)

        # Create the 'data_db_user_mapping' user mapping if it doesn't exist
        self.stdout.write("Creating the 'data_db_user_mapping' user mapping if it doesn't exist...")
        with connections['timeseries'].cursor() as cursor:
            self.create_user_mapping(cursor)

        # Import sensors table
        self.stdout.write("Importing the 'sensors' table if it doesn't exist...")
        with connections['timeseries'].cursor() as cursor:
            self.import_sensors_table(cursor)

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

    def check_and_create_postgres_fdw_extension(self, cursor):
        """Check if the 'postgres_fdw' extension exists and create it if necessary."""
        cursor.execute("SELECT 1 FROM pg_extension WHERE extname = 'postgres_fdw';")
        extension_exists = cursor.fetchone()
        if not extension_exists:
            cursor.execute("CREATE EXTENSION IF NOT EXISTS postgres_fdw;")
            self.stdout.write("Created the 'postgres_fwd' extension.")

    def check_and_create_timescaledb_extension(self, cursor):
        """Check if the 'timescaledb' extension exists and create it if necessary."""
        cursor.execute("SELECT 1 FROM pg_extension WHERE extname = 'timescaledb';")
        extension_exists = cursor.fetchone()
        if not extension_exists:
            cursor.execute("CREATE EXTENSION IF NOT EXISTS timescaledb;")
            self.stdout.write("Created the 'timescaledb' extension.")

    def create_foreign_server(self, cursor):
        """Create the 'data_db_server' foreign server if it doesn't exist."""
        cursor.execute(
            "SELECT 1 FROM pg_foreign_server WHERE srvname = 'data_db_server';"
        )
        server_exists = cursor.fetchone()
        if not server_exists:
            cursor.execute(
                "CREATE SERVER data_db_server FOREIGN DATA WRAPPER postgres_fdw "
                "OPTIONS (host %s, dbname %s, port %s);"
                % (settings.DATABASES['default']['HOST'],
                   settings.DATABASES['default']['NAME'],
                   settings.DATABASES['default']['PORT']),
            )
            self.stdout.write("Created the 'data_db_server' foreign server.")
    
    def create_user_mapping(self, cursor):
        """Create the 'data_db_user_mapping' user mapping if it doesn't exist."""

        try:
            cursor.execute(
                "CREATE USER MAPPING FOR \"%s\" "
                "SERVER data_db_server "
                "OPTIONS (user '%s', password '%s');" % (
                    settings.DATABASES['timeseries']['USER'],
                    settings.DATABASES['default']['USER'],
                    settings.DATABASES['default']['PASSWORD'],
                )
            )
            self.stdout.write("Created the 'data_db_user_mapping' user mapping.")

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"An error occurred while creating the 'data_db_user_mapping' user mapping: {str(e)}"))
            pass

    def import_sensors_table(self, cursor):
        """Import the sensors table if it doesn't exist."""
            # Check if the table exists
        cursor.execute(
            "SELECT 1 "
            "FROM information_schema.tables "
            "WHERE table_schema = 'public' AND table_name = 'data_sensor';"
        )
        table_exists = cursor.fetchone()

        if not table_exists:
            try:
                cursor.execute(
                    "IMPORT FOREIGN SCHEMA public "
                    "LIMIT TO (data_sensor) "
                    "FROM SERVER data_db_server "
                    "INTO public;"
                )
                
                self.stdout.write(self.style.SUCCESS("Successfully created the 'data_sensor' table."))
            except Exception as e:
                self.stderr.write(self.style.ERROR(f"An error occurred while importing the 'data_sensor' table: {str(e)}"))
        else:
            self.stdout.write(self.style.SUCCESS("The 'data_sensor' table already exists."))
