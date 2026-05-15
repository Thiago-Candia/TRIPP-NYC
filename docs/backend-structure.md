# Backend Structure

The backend is a Django project with Django REST Framework.

## Main Project

```txt
tripp/
  manage.py
  tripp/
    settings.py
    urls.py
    wsgi.py
    asgi.py
```

## Installed Apps

| App | Purpose |
| --- | --- |
| `products` | Product catalog, variants and product images |
| `cart` | Cart and cart item persistence |
| `orders` | Checkout, order records, Mercado Pago integration |
| `users` | Auth endpoints and user serialization |
| `stores` | Store ownership/membership and permissions |

Other placeholder apps exist for future expansion:

- `inventory`
- `payments`
- `promotions`
- `shipping`
- `notifications`

## Products App

Files:

```txt
products/models.py
products/serializers.py
products/views.py
products/urls.py
```

Responsibilities:

- Product CRUD
- Category tree
- Product variants
- Product image gallery
- Admin-only mutation permissions
- Public product list/retrieve

Main view:

```py
ProductViewSet
```

Permissions:

- `list`, `retrieve`: `AllowAny`
- create/update/delete/image upload: `CanManageCatalog`

## Cart App

Files:

```txt
cart/models.py
cart/serializer.py
cart/services.py
cart/views.py
cart/urls.py
```

Responsibilities:

- Resolve current cart by authenticated user or session
- Add products and variants
- Update quantities
- Remove cart items
- Clear cart

Main endpoints:

```txt
GET    /api/cart/
POST   /api/cart/
DELETE /api/cart/
PUT    /api/cart/items/:id/
DELETE /api/cart/items/:id/
```

## Orders App

Files:

```txt
orders/models.py
orders/serializers.py
orders/views.py
orders/email.py
orders/urls.py
```

Responsibilities:

- Checkout validation
- Order creation
- Order item snapshots
- Shipping calculation
- Mercado Pago preference creation
- Mercado Pago webhook processing
- Order detail endpoints
- User order history

Main classes:

| Class | Purpose |
| --- | --- |
| `CheckoutView` | Creates pending order and payment preference |
| `MercadoPagoWebhookView` | Confirms payment state |
| `MercadoPagoReturnView` | Redirects Mercado Pago returns to frontend |
| `OrderDetailView` | Returns order detail |
| `MyOrdersView` | Returns authenticated user's orders |

## Users App

Files:

```txt
users/auth_views.py
users/auth_serializers.py
users/models.py
users/urls.py
```

Current auth uses Django's built-in `User` model for login/register. The app also contains custom profile models that can be expanded later.

Endpoints:

```txt
POST /api/users/auth/register/
POST /api/users/auth/login/
GET  /api/users/auth/me/
```

## Stores App

Files:

```txt
stores/models.py
stores/permissions.py
stores/views.py
stores/urls.py
```

Responsibilities:

- Store records
- Store memberships
- Role-based permission foundation
- Admin catalog access

Permissions:

| Permission | Behavior |
| --- | --- |
| `IsSiteAdmin` | Allows staff/superuser |
| `IsStoreTeamMember` | Allows store member roles |
| `CanManageCatalog` | Currently inherits site admin access |

## Settings Notes

Important settings:

```py
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
MERCADOPAGO_ACCESS_TOKEN = os.getenv("MERCADOPAGO_ACCESS_TOKEN", "")
CHECKOUT_SHIPPING_COST = os.getenv("CHECKOUT_SHIPPING_COST", "12.99")
```

Security settings to change before production:

- Move `SECRET_KEY` to environment.
- Set `DEBUG=False`.
- Restrict `ALLOWED_HOSTS`.
- Restrict `CORS_ALLOWED_ORIGINS`.
- Use PostgreSQL.
- Use secure cookies.
- Add rate limiting to auth endpoints.

## Backend Best Practices To Add

- Add `requirements.txt`.
- Add service layer for Mercado Pago logic.
- Store raw webhook events.
- Add tests for permissions, checkout and webhooks.
- Add background job queue for email sending.
