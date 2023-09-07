# Use the TimescaleDB-HA image as the base image
FROM timescale/timescaledb-ha:pg14-all

# Set the environment variables
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=1234
ENV POSTGRES_DB=database_prod

# Expose the PostgreSQL port (although it's not strictly necessary)
EXPOSE 5432

# Should edit 

CMD [ "postgres", "-c", "shared_preload_libraries=timescaledb" ]
