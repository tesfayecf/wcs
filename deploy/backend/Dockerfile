# FROM python:3.9.13-slim

# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1

# WORKDIR /code

# COPY ./backend/requirements.txt .

# RUN pip install --upgrade pip
# RUN pip install -r requirements.txt
# RUN pip install gunicorn
# RUN pip install daphne

# # Install supervisor
# RUN apt-get update && apt-get install -y supervisor && rm -rf /var/lib/apt/lists/*

# COPY ./backend .

# EXPOSE 8000
# EXPOSE 8001

# CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]

# CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
# CMD ["daphne", "-b", "0.0.0.0", "backend.asgi:application"]


# FROM python:3.9.13-slim
# RUN python3 -m venv /opt/venv/
# RUN mkdir /app/backend/
# WORKDIR /app/backend/
# COPY ./apps/backend/ .
# RUN /opt/venv/bin/pip install pip --upgrade && \
#     /opt/venv/bin/pip install -r /app/backend/requirements.txt && \ 
#     chmod +x /app/backend/scripts/entrypoint.sh && \
#     chmod +x /app/backend/scripts/createsuperuser.sh && \
#     chmod +x /app/backend/scripts/migrations.sh && \
#     chmod +x /app/backend/scripts/collectstatic.sh && \
#     bash /app/backend/scripts/migrations.sh && \
#     bash /app/backend/scripts/collectstatic.sh && \
#     bash /app/backend/scripts/createsuperuser.sh
# CMD ["/app/backend/scripts/entrypoint.sh"]

# runit
# FROM python:3.9.13-slim

# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1

# WORKDIR /code

# COPY ./backend/requirements.txt .

# RUN pip install --upgrade pip
# RUN pip install -r requirements.txt
# RUN pip install gunicorn
# RUN pip install daphne

# # Install runit and create run scripts
# RUN apt-get update && apt-get install -y runit && rm -rf /var/lib/apt/lists/*

# # Create run scripts for Gunicorn and Daphne
# RUN mkdir -p /etc/sv/gunicorn /etc/sv/daphne
# RUN echo '#!/bin/sh\nexec gunicorn backend.wsgi:application --bind 0.0.0.0:8000' > /etc/sv/gunicorn/run
# RUN echo '#!/bin/sh\nexec daphne --bind 0.0.0.0 backend.asgi:application' > /etc/sv/daphne/run
# RUN chmod +x /etc/sv/gunicorn/run
# RUN chmod +x /etc/sv/daphne/run

# # # Create log directories and log run scripts (optional)
# # RUN mkdir -p /var/log/gunicorn /var/log/daphne
# # RUN echo '#!/bin/sh\nexec svlogd -tt /var/log/gunicorn' > /etc/sv/gunicorn/log/run
# # RUN echo '#!/bin/sh\nexec svlogd -tt /var/log/daphne' > /etc/sv/daphne/log/run

# # Create symlinks for runit services
# RUN ln -s /etc/sv/gunicorn /etc/service/
# RUN ln -s /etc/sv/daphne /etc/service/

# COPY ./backend .

# EXPOSE 8000
# EXPOSE 8001

# CMD ["runsvdir", "/etc/service"]

#s6
# Use the base Python image
FROM python:3.9.13-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /code

# Copy the requirements file and install dependencies
COPY ./backend/requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install gunicorn
RUN pip install daphne

# Install S6
RUN apt-get update && apt-get install -y s6 && rm -rf /var/lib/apt/lists/*

# Create S6 service directories
RUN mkdir -p /etc/s6/gunicorn /etc/s6/daphne

# Create S6 run scripts for Gunicorn and Daphne
RUN echo '#!/bin/sh\nexec gunicorn backend.wsgi:application --bind 0.0.0.0:8000' > /etc/s6/gunicorn/run
RUN echo '#!/bin/sh\nexec daphne --bind 0.0.0.0 backend.asgi:application' > /etc/s6/daphne/run

# Make S6 run scripts executable
RUN chmod +x /etc/s6/gunicorn/run
RUN chmod +x /etc/s6/daphne/run

# Create S6 service bundle
RUN echo 'gunicorn' > /etc/s6/bundle
RUN echo 'daphne' > /etc/s6/bundle

# Create S6 run script to manage services
RUN echo '#!/bin/sh\nexec s6-rc-bundle -c /etc/s6 /etc/s6/bundle' > /etc/s6/run
RUN chmod +x /etc/s6/run

# Expose the necessary ports
EXPOSE 8000
EXPOSE 8001

# Copy your Django project into the container
COPY ./backend .

# Start S6 as the entry point
CMD ["/etc/s6/run"]
