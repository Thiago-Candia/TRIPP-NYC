# TRIPP NYC Fullstack E-commerce

TRIPP NYC is a fullstack e-commerce project inspired by a professional fashion storefront. It combines a React + Vite frontend, a Django REST Framework backend, JWT authentication, admin-only catalog management, cart persistence, and Mercado Pago Checkout Pro.

The project is designed as a portfolio-grade application and as a base for a production-ready online store.

## Screenshots

> Replace these placeholders with real captures before publishing the portfolio.

| Home | Collection | Product detail | Checkout |
| --- | --- | --- | --- |
| `docs/assets/home.png` | `docs/assets/collection.png` | `docs/assets/product.png` | `docs/assets/checkout.png` |

## Core Features

| Area | Feature |
| --- | --- |
| Storefront | Home, collections, product detail, responsive navigation, search drawer |
| Catalog | Product listing, product images, variants, stock, featured products |
| Cart | Persistent client cart, backend cart sync, sidebar cart, full cart page |
| Checkout | Customer data form, order creation, shipping calculation, Mercado Pago preference |
| Payments | Checkout Pro redirect, `back_urls`, webhook as payment source of truth |
| Auth | Register, login, JWT access token, current user endpoint, logout |
| User area | `/user` profile page with account information and order history |
| Admin | Dashboard for products, inventory, orders and coupons, restricted to admins |

## Tech Stack

### Frontend

- React 18
- Vite
- React Router DOM
- Axios
- TanStack Query
- React Hot Toast
- React Icons
- CSS organized by screen/component

> Note: the current codebase uses custom CSS files, not Tailwind CSS. Tailwind can be introduced later, but the active implementation is React + CSS.

### Backend

- Python
- Django
- Django REST Framework
- Simple JWT
- Django CORS Headers
- Django Filter
- Djoser / Django Allauth configured
- Mercado Pago SDK
- SQLite for local development

## Documentation Map

| File | Purpose |
| --- | --- |
| [`docs/setup.md`](docs/setup.md) | Local installation, dependencies, environment variables and run commands |
| [`docs/api.md`](docs/api.md) | REST API endpoints, payloads, responses, status codes and examples |
| [`docs/architecture.md`](docs/architecture.md) | System architecture, data flow and high-level technical decisions |
| [`docs/database.md`](docs/database.md) | Models, relationships and conceptual database diagrams |
| [`docs/checkout-flow.md`](docs/checkout-flow.md) | Mercado Pago Checkout Pro flow, webhooks, `back_urls` and payment states |
| [`docs/deployment.md`](docs/deployment.md) | Production deployment checklist and hosting recommendations |
| [`docs/frontend-structure.md`](docs/frontend-structure.md) | Frontend folders, screens, components, contexts, API layer and styling |
| [`docs/backend-structure.md`](docs/backend-structure.md) | Django apps, serializers, views, permissions and service boundaries |
| [`docs/authentication.md`](docs/authentication.md) | JWT authentication, roles, admin permissions and frontend session flow |
| [`docs/roadmap.md`](docs/roadmap.md) | Product roadmap with complexity and production priorities |
| [`docs/documentation-standards.md`](docs/documentation-standards.md) | Documentation practices used to keep the project maintainable |

## Project Structure

```txt
TRIPP-NYC-main/
  client/
    src/
      api/
      Assets/
      Components/
      Context/
      Hooks/
      Screens/
      Styles/
      utils/
  tripp/
    cart/
    orders/
    products/
    stores/
    users/
    tripp/
      settings.py
      urls.py
```

## Quick Start

### 1. Clone the project

```bash
git clone <repository-url>
cd TRIPP-NYC-main
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Default frontend URL:

```txt
http://localhost:5173
```

### 3. Backend

```bash
cd tripp
python -m venv .venv
.venv\Scripts\activate
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers django-filter djoser django-allauth mercadopago pillow
python manage.py migrate
python manage.py runserver
```

Default backend URL:

```txt
http://localhost:8000
```

## Environment Variables

Backend variables live in `tripp/.env`.

```env
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
MERCADOPAGO_ACCESS_TOKEN=TEST-your-access-token
MERCADOPAGO_WEBHOOK_SECRET=
CHECKOUT_SHIPPING_COST=12.99
```

Frontend variables can live in `client/.env`.

```env
VITE_API_URL=http://localhost:8000/api
```

For Mercado Pago webhooks in local development, `BACKEND_URL` must be a public HTTPS URL, for example an ngrok URL:

```env
BACKEND_URL=https://your-ngrok-domain.ngrok-free.app
```

## Checkout Summary

```txt
Cart -> Checkout form -> Django Order pending -> Mercado Pago preference
-> User pays in Mercado Pago -> Webhook confirms payment
-> Order becomes paid -> Confirmation email -> Cart is cleared
```

The backend intentionally does not mark an order as paid when the user returns to the frontend. The webhook is the source of truth.

## Main API Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/products/` | List active products |
| `GET` | `/api/products/:id/` | Retrieve product detail |
| `POST` | `/api/products/` | Create product, admin only |
| `GET` | `/api/cart/` | Get current cart |
| `POST` | `/api/cart/` | Add product to cart |
| `POST` | `/api/orders/checkout/` | Create order and Mercado Pago preference |
| `POST` | `/api/orders/webhook/` | Mercado Pago webhook |
| `GET` | `/api/orders/:id/` | Retrieve order detail |
| `GET` | `/api/orders/me/` | Retrieve current user orders |
| `POST` | `/api/users/auth/login/` | Login |
| `POST` | `/api/users/auth/register/` | Register |
| `GET` | `/api/users/auth/me/` | Current authenticated user |

Full API documentation is available in [`docs/api.md`](docs/api.md).

## Deployment Overview

Recommended production split:

- Frontend: Vercel, Netlify or static hosting.
- Backend: Render, Railway, Fly.io, VPS or Docker host.
- Database: PostgreSQL.
- Media files: S3-compatible storage or Cloudinary.
- Payments: Mercado Pago production credentials.
- Domain: HTTPS required for payment webhooks.

Detailed deployment notes are in [`docs/deployment.md`](docs/deployment.md).

## Production Checklist

- Move `SECRET_KEY` to environment variables.
- Set `DEBUG=False`.
- Configure `ALLOWED_HOSTS`.
- Use PostgreSQL instead of SQLite.
- Add `requirements.txt`.
- Configure static/media storage.
- Configure Mercado Pago production access token.
- Validate webhook signatures.
- Add automated tests for checkout and permissions.
- Add monitoring and error tracking.

## Roadmap

Short-term priorities:

- Harden checkout tests.
- Add stock reservation or stock decrement on paid webhook.
- Improve order admin workflow.
- Add production email provider.
- Add image optimization pipeline.

See [`docs/roadmap.md`](docs/roadmap.md) for a structured roadmap with complexity levels.

## License

This project is currently intended for private portfolio and learning purposes. Add a license before public or commercial distribution.
