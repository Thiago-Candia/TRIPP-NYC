# Mercado Pago Checkout Flow

The project uses Mercado Pago Checkout Pro.

## Goal

The checkout must never trust the frontend as the final payment confirmation. The frontend can show a success screen, but only the Mercado Pago webhook updates the order as paid.

## End-to-End Flow

```txt
1. User adds product to cart
2. CartContext syncs local cart with backend cart
3. User completes checkout form
4. Frontend calls POST /api/orders/checkout/
5. Django validates checkout data
6. Django reads trusted server cart
7. Django creates Order(status=pending)
8. Django creates OrderItems from cart snapshot
9. Django creates Mercado Pago preference
10. Frontend redirects user to init_point
11. User pays in Mercado Pago
12. Mercado Pago calls /api/orders/webhook/
13. Backend fetches payment detail from Mercado Pago
14. Backend maps payment status to local order status
15. If approved: order becomes paid, email is sent, cart is cleared
16. User returns to /checkout/success, /checkout/failure or /checkout/pending
```

## Preference Creation

File:

```txt
tripp/orders/views.py
```

Endpoint:

```http
POST /api/orders/checkout/
```

Preference payload:

```json
{
  "items": [
    {
      "id": "6",
      "title": "ZIP ECKO UNLTD",
      "quantity": 1,
      "unit_price": 40.0,
      "currency_id": "ARS"
    }
  ],
  "payer": {
    "email": "customer@example.com"
  },
  "back_urls": {
    "success": "https://backend.example.com/api/orders/return/success/",
    "failure": "https://backend.example.com/api/orders/return/failure/",
    "pending": "https://backend.example.com/api/orders/return/pending/"
  },
  "auto_return": "approved",
  "external_reference": "42",
  "notification_url": "https://backend.example.com/api/orders/webhook/",
  "statement_descriptor": "TRIPP NYC"
}
```

## Important Fields

| Field | Purpose |
| --- | --- |
| `items` | Products and shipping sent to Mercado Pago |
| `payer.email` | Customer email |
| `back_urls.success` | Backend return URL after approved payment |
| `back_urls.failure` | Backend return URL after rejected payment |
| `back_urls.pending` | Backend return URL after pending payment |
| `auto_return` | Automatically returns only on approved payment |
| `external_reference` | Local order id |
| `notification_url` | Webhook endpoint |

## Why Backend Return URLs?

Mercado Pago returns to backend URLs first:

```txt
/api/orders/return/success/
/api/orders/return/failure/
/api/orders/return/pending/
```

Then Django redirects to frontend:

```txt
/checkout/success
/checkout/failure
/checkout/pending
```

This keeps redirect configuration centralized in backend settings and prevents missing `back_url.success` errors.

## Webhook

Endpoint:

```http
POST /api/orders/webhook/
```

Accepted notification types:

- `payment`
- `merchant_order`

The webhook:

1. Validates Mercado Pago signature if `MERCADOPAGO_WEBHOOK_SECRET` is set.
2. Reads notification id.
3. Requests payment or merchant order data from Mercado Pago.
4. Extracts `external_reference`.
5. Finds the local `Order`.
6. Maps Mercado Pago status to local status.
7. Saves payment ids.
8. Sends confirmation email once.
9. Clears cart only after approved payment.

## Payment Status Mapping

| Mercado Pago status | Local order status |
| --- | --- |
| `approved` | `paid` |
| `rejected` | `cancelled` |
| `cancelled` | `cancelled` |
| `refunded` | `refunded` |
| `charged_back` | `refunded` |
| `pending` | `pending` |
| `in_process` | `pending` |
| `authorized` | `pending` |

## Frontend Status Screens

Routes:

```txt
/checkout/success
/checkout/failure
/checkout/pending
```

Screen:

```txt
client/src/Screens/CheckoutStatusScreen.jsx
```

Reusable components:

```txt
client/src/Components/checkout/CheckoutStatusLayout.jsx
client/src/Components/checkout/OrderSummary.jsx
client/src/Components/checkout/PaymentStatusBadge.jsx
```

The screen reads Mercado Pago query params:

- `payment_id`
- `status`
- `external_reference`

Then it calls:

```http
GET /api/orders/:id/
```

## Required Environment

```env
FRONTEND_URL=http://localhost:5173
BACKEND_URL=https://public-https-backend-url
MERCADOPAGO_ACCESS_TOKEN=TEST-your-access-token
MERCADOPAGO_WEBHOOK_SECRET=
CHECKOUT_SHIPPING_COST=12.99
```

## Local Testing Matrix

| Case | Expected result |
| --- | --- |
| Approved payment | Order becomes `paid`, cart clears, email is sent once |
| Rejected payment | Order becomes `cancelled` |
| Pending payment | Order remains `pending` |
| Invalid access token | API returns Mercado Pago auth error |
| Empty server cart | API returns `server_cart_empty` |
| Missing public backend URL | Webhook does not arrive |

## Production Notes

- Use a real production Mercado Pago access token.
- Use HTTPS for `BACKEND_URL`.
- Keep webhook idempotent.
- Do not clear cart before payment approval.
- Store raw webhook events in a future `PaymentEvent` model for auditability.
