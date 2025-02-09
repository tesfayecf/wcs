import pytest
from django.db import connection
from django.apps import apps

@pytest.fixture(autouse=True)
def clear_db():
    """Clears all database tables after each test."""
    yield  # Run the test first

    with connection.cursor() as cursor:
        cursor.execute("SET session_replication_role = 'replica';")  # PostgreSQL: Disable foreign key constraints
        for model in apps.get_models():
            cursor.execute(f'TRUNCATE TABLE "{model._meta.db_table}" CASCADE;')  # Truncate all tables
        cursor.execute("SET session_replication_role = 'origin';")  # Re-enable constraints
