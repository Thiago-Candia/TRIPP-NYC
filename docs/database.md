# Database Documentation

Local development uses SQLite. Production should use PostgreSQL.

## Conceptual Model

```txt
Store 1---N Product
Product 1---N ProductVariant
Product 1---N ProductImage
Product N---1 Category

Cart 1---N CartItem
CartItem N---1 Product
CartItem N---0..1 ProductVariant

Order 1---N OrderItem
Order N---0..1 Cart
Order N---0..1 User
OrderItem N---0..1 Product
OrderItem N---0..1 ProductVariant
```

## Product Catalog

### Category

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | Category name |
| `slug` | slug | Unique URL-friendly name |
| `parent` | FK self | Enables nested categories |

### Product

| Field | Type | Notes |
| --- | --- | --- |
| `store` | FK Store | Optional store owner |
| `name` | string | Product name |
| `description` | text | Product description |
| `price` | decimal | Base price |
| `category` | FK Category | Optional |
| `slug` | slug | Auto-generated |
| `sku` | string | Unique, nullable |
| `stock` | integer | Global stock |
| `compare_at_price` | decimal | Previous price |
| `is_active` | boolean | Public visibility |
| `is_featured` | boolean | Featured sections |

Computed properties:

- `is_on_sale`
- `is_in_stock`
- `discount_percentage`

### ProductVariant

Represents sellable variants such as size and color.

| Field | Type | Notes |
| --- | --- | --- |
| `product` | FK Product | Parent product |
| `size` | string | XXS, XS, S, M, L, XL, XXL, XXXL |
| `color` | string | Optional |
| `color_code` | string | Hex color |
| `sku` | string | Unique, nullable |
| `price_adjustment` | decimal | Added to product price |
| `stock` | integer | Variant stock |
| `is_active` | boolean | Can be sold |

### ProductImage

| Field | Type | Notes |
| --- | --- | --- |
| `product` | FK Product | Parent product |
| `image` | image | Uploaded file |
| `alt_text` | string | Accessibility text |
| `is_primary` | boolean | Main product image |
| `order` | integer | Gallery order |

The first uploaded image becomes primary automatically.

## Cart

### Cart

| Field | Type | Notes |
| --- | --- | --- |
| `auth_user` | OneToOne User | Django auth user cart |
| `user` | OneToOne CustomUser | Legacy custom user cart |
| `session_id` | string | Anonymous cart |

Computed properties:

- `total_items`
- `subtotal`
- `total`

### CartItem

| Field | Type | Notes |
| --- | --- | --- |
| `cart` | FK Cart | Parent cart |
| `product` | FK Product | Product added |
| `variant` | FK ProductVariant | Optional selected variant |
| `quantity` | integer | Quantity |
| `subtotal` | property | `price * quantity` |

Constraint:

```txt
unique_together = cart + product + variant
```

## Orders

### Order

| Field | Type | Notes |
| --- | --- | --- |
| `cart` | FK Cart | Source cart |
| `user` | FK AUTH_USER_MODEL | Logged-in buyer if available |
| `email` | email | Checkout email |
| `first_name` | string | Customer first name |
| `last_name` | string | Customer last name |
| `address_line1` | string | Shipping address |
| `city` | string | Shipping city |
| `state` | string | Shipping state |
| `zip_code` | string | Postal code |
| `country` | string | Defaults to AR |
| `subtotal` | decimal | Products subtotal |
| `shipping_cost` | decimal | Shipping amount |
| `total` | decimal | Final total |
| `status` | string | pending, paid, cancelled, etc. |
| `mp_preference_id` | string | Mercado Pago preference |
| `mp_payment_id` | string | Mercado Pago payment |
| `mp_merchant_order_id` | string | Mercado Pago merchant order |
| `confirmation_email_sent` | boolean | Idempotency flag |

### OrderItem

Order items snapshot product data at purchase time.

| Field | Type | Notes |
| --- | --- | --- |
| `order` | FK Order | Parent order |
| `product` | FK Product | Nullable historical reference |
| `variant` | FK ProductVariant | Nullable historical reference |
| `name` | string | Product name at purchase time |
| `sku` | string | SKU at purchase time |
| `price` | decimal | Unit price |
| `quantity` | integer | Quantity |
| `subtotal` | decimal | Line total |

## Order Flow Data

```txt
Cart
  items
    CartItem(product, variant, quantity)
      |
      v
CheckoutView
  creates Order(status=pending)
  creates OrderItems(snapshot)
      |
      v
Mercado Pago webhook
  updates Order(status=paid/cancelled/pending)
```

## Production Database Recommendations

- Use PostgreSQL.
- Add indexes to `Order.status`, `Order.email`, `Product.is_active`, `Product.is_featured`.
- Add stock movement history before decrementing stock.
- Add immutable payment event table for auditing Mercado Pago notifications.
- Add soft-delete or archival strategy for products.
