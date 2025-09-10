# WCS Project

A full-stack system for sensor data collection, processing, and visualization.

## Table of Contents

- [Overview](#overview)
- [Backend (Django)](#backend-django)
- [Frontend (Next.js)](#frontend-nextjs)
- [Sensor](#sensor)
- [Deployment](#deployment)
- [Development](#development)
- [License](#license)

---

## Overview

WCS is a modular platform for collecting, storing, and visualizing sensor and weather data. It uses Django for the backend, Next.js for the frontend, and supports MQTT for real-time data ingestion.

---

## Backend (Django)

- **Location:** `backend/`
- **Tech:** Django 5, Django REST Framework, PostgreSQL, TimescaleDB, EMQX MQTT broker
- **Setup:**
  1. Install [uv](https://github.com/astral-sh/uv) (Python project manager)
  2. Install Python 3.10+
  3. Install dependencies:  
	  ```bash
	  uv pip install -r requirements.txt
	  ```
  4. Install PostgreSQL and TimescaleDB
  5. Set up PostgreSQL user and database:
	  - Switch to postgres user: `sudo -i -u postgres`
	  - Enter psql: `psql`
	  - Change password, create roles, and databases as needed
	  - Run `scripts/create_database.py`
  6. Install EMQX (MQTT broker)
  7. Run the backend:
	  ```bash
	  python manage.py migrate
	  python manage.py runserver
	  ```

---

## Frontend (Next.js)

- **Location:** `frontend/`
- **Tech:** Next.js 14, React 18, Ant Design, MUI, Chart.js, Zustand, TypeScript
- **Setup:**
  1. Install [pnpm](https://pnpm.io/)
  2. Install dependencies:
	  ```bash
	  pnpm install
	  ```
  3. Run the development server:
	  ```bash
	  pnpm dev
	  ```

---

## Sensor

- **Location:** `sensor/`
- **Tech:** Arduino (ESP8266)
- **Setup:**  
  See `sensor/sensor.ino` and `sensor/arduino-cli/config.yml` for firmware and build instructions.

---

## Deployment

- **Location:** `deploy/`
- **Tech:** Docker, Docker Compose, Nginx, EMQX, PostgreSQL
- **Setup:**
  1. Copy `.env` files as needed to `deploy/backend/backend_wsgi/`, `deploy/backend/backend_asgi/`, and `deploy/database/`
  2. Build and start all services:
	  ```bash
	  cd deploy
	  docker compose up --build
	  ```
  3. Services:
	  - `backend_wsgi` (Django WSGI)
	  - `backend_asgi` (Django ASGI)
	  - `frontend` (Next.js)
	  - `database` (PostgreSQL + TimescaleDB)
	  - `emqx` (MQTT broker)
	  - `nginx` (reverse proxy)

---

## Development

- Backend: See `backend/README.md`
- Frontend: See `frontend/README.md`
- Sensor: See `sensor/README.md`

---

## License

[MIT](LICENSE) or as specified in subfolders.

---
