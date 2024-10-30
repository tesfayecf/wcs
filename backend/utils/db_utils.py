from django.db import connection

def truncate_tables(tables):
    with connection.cursor() as cursor:
        for table in tables:
            cursor.execute(f"TRUNCATE TABLE {table} CASCADE;")