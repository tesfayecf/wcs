FROM python:3.9.13-slim

RUN python3 -m venv /opt/venv/

RUN mkdir /app/backend/

WORKDIR /app/backend/
COPY ./apps/backend/ .

RUN /opt/venv/bin/pip install pip --upgrade && \
    /opt/venv/bin/pip install -r /app/backend/requirements.txt && \ 
    chmod +x /app/backend/scripts/entrypoint.sh && \
    chmod +x /app/backend/scripts/createsuperuser.sh && \
    chmod +x /app/backend/scripts/migrations.sh && \
    chmod +x /app/backend/scripts/collectstatic.sh && \
    bash /app/backend/scripts/migrations.sh && \
    bash /app/backend/scripts/collectstatic.sh && \
    bash /app/backend/scripts/createsuperuser.sh


CMD ["/app/web/scripts/entrypoint.sh"]