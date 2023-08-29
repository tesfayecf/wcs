FROM python:3.9.13-slim

WORKDIR /code

COPY ./backend/requirements.txt .

RUN pip install -r requirements.txt

COPY ./backend .

EXPOSE 8000

CMD ["daphne", "-b", "0.0.0.0", "backend.asgi:application"]
