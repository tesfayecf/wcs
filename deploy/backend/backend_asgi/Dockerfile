FROM python:3.9.13-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY ./backend/requirements.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install daphne

COPY ./backend .

EXPOSE 8001

CMD ["daphne", "-b", "0.0.0.0", "-p", "8001", "backend.asgi:application"]