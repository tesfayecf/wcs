## Django Backend

# Set up

Install uv python project manager

Install python 3.10

Install packages with uv

Install postgresql

Run "sudo -i -u postgres" to change to postgres user
Log into postgres with "psql"
Change postgres password
Create databse roles with roles.sql
Run create_database.py script (this script uses the default postgres database to establish the first connection)

Install emqx 5.8.4

Install:
    - uv (python 3.10)
    - postgresql (sudo apt install postgresql --> 16.6)
    - timescaledb (sudo apt-get install timescaledb-2-2.18.0-postgresql-16=2.18.0~ubuntu24.04)
    - emqx
