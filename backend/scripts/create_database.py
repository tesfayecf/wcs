import os
from dotenv import load_dotenv
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Load environment variables
load_dotenv()

def get_db_settings():
    return {
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT')
    }

def connect_to_postgres(db_settings, db_name="postgres"):
    """Connect to the PostgreSQL server"""
    return psycopg2.connect(
        dbname=db_name,
        user=db_settings['USER'],
        password=db_settings['PASSWORD'],
        host=db_settings['HOST'],
        port=db_settings['PORT']
    )

def database_exists(db_settings):
    """Check if the database exists"""
    try:
        conn = connect_to_postgres(db_settings)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname='{db_settings['NAME']}';")
        exists = cursor.fetchone()
        cursor.close()
        conn.close()
        return exists is not None
    except Exception as e:
        print(f"Error checking database existence: {e}")
        return False

def drop_database(db_settings):
    """Drop the database if it exists"""
    try:
        conn = connect_to_postgres(db_settings)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        cursor.execute(f"DROP DATABASE IF EXISTS {db_settings['NAME']};")
        cursor.close()
        conn.close()
        print(f"Database {db_settings['NAME']} dropped successfully.")
    except Exception as e:
        print(f"Error dropping database: {e}")

def create_database(db_settings):
    """Create the database"""
    try:
        conn = connect_to_postgres(db_settings)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE {db_settings['NAME']};")
        cursor.close()
        conn.close()
        print(f"Database {db_settings['NAME']} created successfully.")
    except Exception as e:
        print(f"Error creating database: {e}")

def check_timescaledb_extension(db_settings):
    """Check if the 'timescaledb' extension exists"""
    try:
        conn = connect_to_postgres(db_settings, db_settings['NAME'])
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM pg_extension WHERE extname = 'timescaledb';")
        extension_exists = cursor.fetchone() is not None
        cursor.close()
        conn.close()
        return extension_exists
    except Exception as e:
        print(f"Error checking timescaledb extension: {e}")
        return False

def create_timescaledb_extension(db_settings):
    """Create the 'timescaledb' extension if it doesn't exist"""
    try:
        conn = connect_to_postgres(db_settings, db_settings['NAME'])
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        cursor.execute("CREATE EXTENSION IF NOT EXISTS timescaledb;")
        cursor.close()
        conn.close()
        print("Created the 'timescaledb' extension.")
    except Exception as e:
        print(f"Error creating timescaledb extension: {e}")

def main():
    db_settings = get_db_settings()

    print("Checking if the database exists...")
    if database_exists(db_settings):
        print(f"Database {db_settings['NAME']} exists. Dropping it...")
        drop_database(db_settings)
    
    print(f"Creating database {db_settings['NAME']}...")
    create_database(db_settings)

    print("Checking if the 'timescaledb' extension exists...")
    if check_timescaledb_extension(db_settings):
        print("The 'timescaledb' extension already exists.")
    else:
        print("The 'timescaledb' extension does not exist. Creating it...")
        create_timescaledb_extension(db_settings)

if __name__ == "__main__":
    main()