# REST API Documentation

Base URL:

```txt
http://localhost:8000/api
```

Frontend API client:

```txt
client/src/api/axios.js
```

The client sends JWT tokens with:

```http
Authorization: Bearer <access_token>
```

## Authentication

### Register

```http
POST /api/users/auth/register/
```

Request:

```json
{
  "username": "customer",
  "email": "customer@example.com",
  "password": "strong-password"
}
```

Response `201`:

```json
{
  "access": "jwt-access-token",
  "refresh": "jwt-refresh-token",
  "user": {
    "id": 1,
    "username": "customer",
    "email": "customer@example.com",
    "role": "user",
    "is_staff": false,
    "is_superuser": false,
    "stores": []
  }
}
```

### Login

```http
POST /api/users/auth/login/
```

Request:

```json
{
  "username": "admin",
  "password": "strong-password"
}
```

Response `200` returns the same token structure as register.

Common errors:

| Status | Body | Meaning |
| --- | --- | --- |
| `400` | serializer errors | Missing or invalid credentials |
| `401` | `{"detail": "Credenciales inválidas."}` | Invalid login |

### Current User

```http
GET /api/users/auth/me/
```

Requires JWT.

Response `200`:

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "first_name": "",
  "last_name": "",
  "role": "admin",
  "is_staff": true,
  "is_superuser": true,
  "stores": []
}
```

## Products

### List Products

```http
GET /api/products/
```

Public endpoint. Only active products are returned.

Supported filters:

| Query | Example |
| --- | --- |
| `search` | `/api/products/?search=red` |
| `ordering` | `/api/products/?ordering=price` |
| `is_featured` | `/api/products/?is_featured=true` |
| `store_id` | `/api/products/?store_id=1` |

Response `200` can be paginated by DRF:

```json
{
  "count": 12,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 6,
      "name": "ZIP ECKO UNLTD",
      "description": "Product description",
      "price": "40.00",
      "sku": "PROD-1778735060826",
      "stock": 0,
      "is_active": true,
      "is_featured": false,
      "primary_image": "http://localhost:8000/media/products/gallery/2026/05/image.jpg",
      "images": [],
      "variants": []
    }
  ]
}
```

### Retrieve Product

```http
GET /api/products/:id/
```

Response `200`:

```json
{
  "id": 6,
  "name": "ZIP ECKO UNLTD",
  "price": "40.00",
  "primary_image": "http://localhost:8000/media/products/gallery/2026/05/image.jpg",
  "variants": [
    {
      "id": 4,
      "size": "XL",
      "stock": 1,
      "final_price": "40.00"
    }
  ]
}
```

### Create Product

```http
POST /api/products/
```

Requires admin permissions.

Headers:

```http
Authorization: Bearer <admin_access_token>
X-Store-Id: 1
```

Request:

```json
{
  "name": "SP RED TAB",
  "description": "Denim pants",
  "price": "150.00",
  "stock": 1,
  "is_active": true,
  "is_featured": false,
  "variants": [
    {
      "size": "L",
      "color": "",
      "stock": 1,
      "price_adjustment": "0.00"
    }
  ]
}
```

### Upload Product Images

```http
POST /api/products/:id/upload-images/
```

Requires admin permissions and multipart form data.

Form field:

```txt
images=<file[]>
```

Response `201`:

```json
{
  "detail": "Imágenes cargadas.",
  "image_ids": [10, 11]
}
```

### Delete Product Image

```http
DELETE /api/products/:id/images/:image_id/
```

Returns `204`.

## Cart

### Get Cart

```http
GET /api/cart/
```

Response `200`:

```json
{
  "id": 1,
  "items": [
    {
      "id": 10,
      "product": {
        "id": 6,
        "name": "ZIP ECKO UNLTD",
        "price": "40.00"
      },
      "variant": {
        "id": 4,
        "size": "XL"
      },
      "quantity": 1,
      "subtotal": "40.00"
    }
  ],
  "total_items": 1,
  "subtotal": "40.00",
  "total": "40.00"
}
```

### Add To Cart

```http
POST /api/cart/
```

Request:

```json
{
  "product_id": 6,
  "variant_id": 4,
  "quantity": 1
}
```

Errors:

| Status | Body |
| --- | --- |
| `400` | `{"error": "Quantity must be greater than zero"}` |
| `404` | `{"error": "Product not found"}` |
| `404` | `{"error": "Variant not found for this product"}` |

### Update Cart Item

```http
PUT /api/cart/items/:item_id/
```

Request:

```json
{
  "quantity": 2
}
```

### Remove Cart Item

```http
DELETE /api/cart/items/:item_id/
```

### Clear Cart

```http
DELETE /api/cart/
```

## Orders and Checkout

### Create Checkout

```http
POST /api/orders/checkout/
```

Creates a local pending order and a Mercado Pago Checkout Pro preference.

Request:

```json
{
  "email": "customer@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "phone": "1122334455",
  "address_line1": "Av. Siempre Viva 123",
  "address_line2": "Piso 2",
  "city": "Buenos Aires",
  "state": "CABA",
  "zip_code": "1000",
  "country": "AR"
}
```

Response `201`:

```json
{
  "order_id": 42,
  "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=...",
  "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=..."
}
```

Errors:

| Status | Code | Meaning |
| --- | --- | --- |
| `400` | `server_cart_empty` | Backend cart has no items |
| `503` | payment gateway not configured | Missing Mercado Pago token |
| `503` | unauthorized | Invalid Mercado Pago token |
| `502` | Mercado Pago preference error | Preference creation failed |

### Retrieve Order

```http
GET /api/orders/:id/
```

Response:

```json
{
  "id": 42,
  "email": "customer@example.com",
  "subtotal": "150.00",
  "shipping_cost": "0.00",
  "total": "150.00",
  "status": "paid",
  "mp_preference_id": "123456",
  "mp_payment_id": "987654",
  "items": [
    {
      "id": 1,
      "name": "SP RED TAB",
      "sku": "PROD-1778112272494",
      "price": "150.00",
      "quantity": 1,
      "subtotal": "150.00"
    }
  ],
  "created_at": "2026-05-14T00:00:00Z"
}
```

### Current User Orders

```http
GET /api/orders/me/
```

Requires JWT.

## Mercado Pago Webhook

```http
POST /api/orders/webhook/
```

Used by Mercado Pago. The API accepts `payment` and `merchant_order` notifications, fetches payment data from Mercado Pago, maps payment status to local order status, sends confirmation email once and clears cart after approved payment.

## Error Format

The project currently uses a pragmatic format:

```json
{
  "error": "Human-readable error",
  "code": "optional_machine_code"
}
```

Serializer validation errors follow DRF defaults:

```json
{
  "email": ["Enter a valid email address."]
}
```
