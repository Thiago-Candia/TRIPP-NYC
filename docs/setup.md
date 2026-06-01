# Setup Guide

This guide explains how to run TRIPP NYC locally for frontend, backend, authentication, cart and Mercado Pago checkout testing.

## Requirements

| Tool | Recommended |
| --- | --- |
| Node.js | 18+ |
| npm | 9+ |
| Python | 3.11+ |
| pip | Latest |
| Git | Latest |
| ngrok | Required for local Mercado Pago webhooks |

## Repository Layout

```txt
TRIPP-NYC-main/
  client/       React + Vite app
  tripp/        Django project
```

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

The frontend reads this value in `client/src/api/axios.js`.

## Backend Setup

```bash
cd tripp
python -m venv .venv
.venv\Scripts\activate
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers django-filter djoser django-allauth mercadopago pillow
python manage.py migrate
python manage.py runserver
```

The backend currently does not include a committed `requirements.txt`. For production, generate one:

```bash
pip freeze > requirements.txt
```

## Backend Environment

Create `tripp/.env`:

```env
DJANGO_DEBUG=True
SECRET_KEY=change-me-in-production
ALLOWED_HOSTS=localhost,127.0.0.1
CSRF_TRUSTED_ORIGINS=
CORS_ALLOWED_ORIGINS=http://localhost:5173
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
MERCADOPAGO_ACCESS_TOKEN=TEST-your-access-token
MERCADOPAGO_WEBHOOK_SECRET=
CHECKOUT_SHIPPING_COST=12.99
```

### Local Checkout With Webhooks

Mercado Pago cannot call `localhost`. Use ngrok or another public HTTPS tunnel:

```bash
ngrok http 8000
```

Then update:

```env
BACKEND_URL=https://your-ngrok-domain.ngrok-free.app
ALLOWED_HOSTS=localhost,127.0.0.1,your-ngrok-domain.ngrok-free.app
CSRF_TRUSTED_ORIGINS=https://your-ngrok-domain.ngrok-free.app
```

Restart Django after changing `.env`.

## Database

Local development uses SQLite:

```txt
tripp/db.sqlite3
```

Run migrations:

```bash
cd tripp
python manage.py migrate
```

Create an admin user:

```bash
python manage.py createsuperuser
```

## Running Both Apps

Terminal 1:

```bash
cd tripp
.venv\Scripts\activate
python manage.py runserver
```

Terminal 2:

```bash
cd client
npm run dev
```

## Useful URLs

| URL | Purpose |
| --- | --- |
| `http://localhost:5173` | Storefront |
| `http://localhost:5173/collections` | Product collection |
| `http://localhost:5173/dashboard` | Admin dashboard |
| `http://localhost:8000/admin/` | Django admin |
| `http://localhost:8000/api/products/` | Products API |

## Validation Commands

Frontend:

```bash
cd client
npm run lint
npm run build
```

Backend:

```bash
cd tripp
python manage.py check
python manage.py test
```
