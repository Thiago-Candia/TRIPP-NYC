# Architecture

TRIPP NYC follows a client-server architecture:

```txt
Browser
  |
  | React Router + Axios
  v
React/Vite Frontend
  |
  | REST JSON API
  v
Django REST Framework
  |
  | ORM
  v
SQLite local / PostgreSQL production

Mercado Pago Checkout Pro
  |                         ^
  | redirect                | webhook
  v                         |
Customer payment page ------+
```

## Architectural Goals

| Goal | Implementation |
| --- | --- |
| Portfolio quality | Clear separation between frontend, backend and docs |
| Future scalability | Modular Django apps and API service layer on frontend |
| Payment correctness | Webhook confirms payment instead of frontend redirect |
| Admin safety | Product mutations restricted to admin users |
| UX consistency | Screen-specific CSS and reusable UI components |

## Main Runtime Flow

```txt
User opens storefront
  -> ProductProvider loads products
  -> User selects product variant
  -> CartContext syncs local cart with backend cart
  -> CheckoutScreen submits customer data
  -> Django creates Order + OrderItems
  -> Mercado Pago preference is created
  -> Frontend redirects user to Mercado Pago
  -> Mercado Pago sends webhook
  -> Django updates Order status
  -> User sees success/failure/pending page
```

## Frontend Layers

| Layer | Folder | Responsibility |
| --- | --- | --- |
| Routing | `client/src/App.jsx` | Route registration |
| Screens | `client/src/Screens` | Page-level views |
| Components | `client/src/Components` | Reusable UI blocks |
| API services | `client/src/api` | Axios requests |
| State | `client/src/Context` | Auth, cart and product state |
| Hooks | `client/src/Hooks` | Reusable behavior |
| Styles | `client/src/Styles` | CSS by screen/component |

## Backend Layers

| Layer | Folder | Responsibility |
| --- | --- | --- |
| Project config | `tripp/tripp` | Settings, root URLs, WSGI/ASGI |
| Products | `tripp/products` | Catalog, variants and images |
| Cart | `tripp/cart` | Cart and cart item persistence |
| Orders | `tripp/orders` | Checkout, orders, Mercado Pago webhook |
| Users | `tripp/users` | Auth endpoints and user serializers |
| Stores | `tripp/stores` | Store memberships and catalog permissions |

## Data Ownership

| Data | Source of truth |
| --- | --- |
| Product catalog | Django database |
| Auth session | JWT in frontend localStorage |
| Cart UX | Frontend state with backend sync |
| Paid order status | Mercado Pago webhook |
| Admin access | Django `is_staff`, `is_superuser` and store membership |

## Important Technical Decisions

### Webhook As Source Of Truth

The checkout does not mark an order as paid when the user returns to `/checkout/success`. The frontend redirect is useful for UX, but the backend trusts Mercado Pago webhook data.

### Admin-only Catalog Management

Public users can list and retrieve active products. Product creation, update, deletion and image upload require `CanManageCatalog`.

### Cart Sync Strategy

The frontend keeps a local cart for responsive UX, then syncs it with the backend. Before checkout, `ensureServerCart` ensures the server cart contains the same products so the backend can create the order from trusted server-side data.

### CSS Architecture

The project currently uses custom CSS grouped by responsibility. For example:

- `product-screen.css`
- `cart-side-bar.css`
- `checkout-status-page.css`
- `dashboard.css`

This is aligned with the existing app and avoids mixing styling methodologies.
