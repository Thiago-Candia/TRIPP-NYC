# Authentication and Authorization

TRIPP NYC uses JWT authentication with Django REST Framework and Simple JWT.

## Authentication Flow

```txt
User registers or logs in
  -> Backend returns access + refresh tokens
  -> Frontend stores tokens in localStorage
  -> Axios sends Authorization: Bearer <access>
  -> Backend identifies request.user
```

## Frontend Session

File:

```txt
client/src/Context/AuthContext.jsx
```

Stored keys:

```txt
access_token
refresh_token
active_store_id
```

AuthContext exposes:

| Value | Purpose |
| --- | --- |
| `user` | Current authenticated user |
| `loadingUser` | Current user loading state |
| `login` | Login function |
| `register` | Register function |
| `logout` | Clears local auth state |
| `fetchCurrentUser` | Calls `/users/auth/me/` |
| `isAdmin` | Staff/superuser/admin role helper |
| `canManageCatalog` | Dashboard/catalog permission helper |

## Backend Endpoints

### Register

```http
POST /api/users/auth/register/
```

Creates a Django `User` and returns JWT tokens.

### Login

```http
POST /api/users/auth/login/
```

Authenticates with `username` and `password`.

### Current User

```http
GET /api/users/auth/me/
Authorization: Bearer <access_token>
```

Returns:

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin",
  "is_staff": true,
  "is_superuser": true,
  "stores": []
}
```

## Roles

| Role | Source | Access |
| --- | --- | --- |
| `user` | Default authenticated user | Shopping, profile, order history |
| `admin` | `is_staff` or `is_superuser` | Dashboard and product management |
| `owner` | StoreMembership | Future store-level ownership |
| `manager` | StoreMembership | Future store-level management |
| `support` | StoreMembership | Future support workflow |

## Catalog Permissions

File:

```txt
tripp/stores/permissions.py
```

`CanManageCatalog` currently inherits `IsSiteAdmin`, so only staff or superusers can mutate products.

Public:

- List products.
- Retrieve product detail.

Admin only:

- Create products.
- Update products.
- Delete products.
- Upload product images.
- Delete product images.

## Frontend Behavior

- Logged-out user icon routes to `/account`.
- Logged-in user icon routes to `/user`.
- Admin users see a dashboard button in `/user`.
- Dashboard product operations require a valid admin JWT.

## Security Recommendations

- Add refresh token rotation.
- Store tokens in secure HTTP-only cookies for production.
- Add rate limiting to login/register.
- Add password reset flow.
- Add email verification if accounts are public.
- Add route guard component for `/dashboard`.
- Avoid exposing admin buttons based only on frontend state; backend permissions must remain authoritative.
