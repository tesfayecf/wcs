FROM python:3.9.13-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY ./backend/requirements.txt .

RUN pip install -r requirements.txt

COPY ./backend .

EXPOSE 8000

CMD ["daphne", "-b", "0.0.0.0", "backend.asgi:application"]



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