# Deployment Guide

This document describes how to prepare TRIPP NYC for production deployment.

## Recommended Production Architecture

```txt
Vercel / Netlify
  React static frontend
        |
        | HTTPS REST API
        v
Render / Railway / VPS
  Django + DRF backend
        |
        v
PostgreSQL

Media storage:
  S3-compatible bucket or Cloudinary

Payments:
  Mercado Pago Checkout Pro
```

## Frontend Deployment

Build command:

```bash
cd client
npm install
npm run build
```

Output:

```txt
client/dist
```

Environment:

```env
VITE_API_URL=https://api.your-domain.com/api
```

## Backend Deployment

Before deploy, add `requirements.txt`:

```bash
cd tripp
pip freeze > requirements.txt
```

Recommended production environment:

```env
SECRET_KEY=production-secret-key
DJANGO_DEBUG=False
ALLOWED_HOSTS=api.your-domain.com
CSRF_TRUSTED_ORIGINS=https://api.your-domain.com
CORS_ALLOWED_ORIGINS=https://your-domain.com
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://api.your-domain.com
MERCADOPAGO_ACCESS_TOKEN=APP_USR-your-production-token
MERCADOPAGO_WEBHOOK_SECRET=your-webhook-secret
CHECKOUT_SHIPPING_COST=12.99
DATABASE_URL=postgres://...
```

## Django Production Checklist

- Move `SECRET_KEY` out of source code.
- Set `DEBUG=False`.
- Configure `ALLOWED_HOSTS`.
- Configure `CSRF_TRUSTED_ORIGINS`.
- Configure `CORS_ALLOWED_ORIGINS`.
- Use PostgreSQL.
- Collect static files.
- Configure media storage.
- Add HTTPS.
- Add server logs and error tracking.
- Run migrations during release.

## Database

SQLite is acceptable for local development only.

Production recommendation:

- PostgreSQL hosted by Render, Railway, Neon, Supabase, AWS RDS or similar.

Migration command:

```bash
python manage.py migrate
```

## Static and Media Files

Product images are uploaded through Django media fields.

Production options:

| Option | Use case |
| --- | --- |
| Cloudinary | Simple image hosting and transformations |
| S3-compatible bucket | More control and standard cloud setup |
| VPS filesystem | Small deployments, less scalable |

## Mercado Pago Production Setup

1. Create production Mercado Pago credentials.
2. Set `MERCADOPAGO_ACCESS_TOKEN`.
3. Configure public HTTPS `BACKEND_URL`.
4. Register webhook URL:

```txt
https://api.your-domain.com/api/orders/webhook/
```

5. Test approved, rejected and pending payments.

## Deployment Smoke Test

After deploy:

| Test | Expected |
| --- | --- |
| `GET /api/products/` | Returns products |
| Register | Returns JWT |
| Login | Returns JWT |
| Add to cart | Server cart updates |
| Checkout | Returns Mercado Pago init point |
| Webhook | Updates order status |
| `/checkout/success` | Shows order summary |
| `/user` | Shows profile and order history |

## Monitoring Recommendations

- Sentry for frontend/backend errors.
- Backend logs for checkout and webhooks.
- Mercado Pago webhook delivery logs.
- Uptime monitor for API health.
- Database backups.

## Production Risks To Resolve

| Risk | Mitigation |
| --- | --- |
| Secret key in settings | Move to environment variable |
| SQLite in production | Use PostgreSQL |
| Webhook audit missing | Add PaymentEvent model |
| Email provider missing | Configure SendGrid, Resend, SES or SMTP |
| No automated tests | Add tests for checkout and permissions |
