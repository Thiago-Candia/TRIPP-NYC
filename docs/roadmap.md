# Roadmap

This roadmap is organized by impact and complexity.

## Phase 1 - Stabilization

Complexity: Low to Medium

| Task | Why it matters |
| --- | --- |
| Add `requirements.txt` | Makes backend reproducible |
| Add `.env.example` files | Improves onboarding and portfolio clarity |
| Add dashboard route guard | Prevents unauthorized UI access |
| Add backend tests for product permissions | Protects admin-only catalog |
| Add checkout integration tests | Prevents payment regressions |

## Phase 2 - Payment Hardening

Complexity: Medium

| Task | Why it matters |
| --- | --- |
| Store raw Mercado Pago webhook events | Auditability and debugging |
| Add Payment model | Separates payment lifecycle from order lifecycle |
| Add stock decrement on paid webhook | Prevents selling unavailable stock |
| Add idempotency keys | Prevents duplicate side effects |
| Add retryable email sending | Prevents lost confirmation emails |

## Phase 3 - Production Deployment

Complexity: Medium

| Task | Why it matters |
| --- | --- |
| Move to PostgreSQL | Production-grade database |
| Configure media storage | Scalable product images |
| Set `DEBUG=False` | Security |
| Configure CORS/CSRF for domain | Secure browser requests |
| Add HTTPS domain | Required for Mercado Pago webhooks |

## Phase 4 - Store Operations

Complexity: Medium to High

| Task | Why it matters |
| --- | --- |
| Order management dashboard | Real admin workflow |
| Inventory movement history | Stock traceability |
| Product category manager | Better catalog operations |
| Coupons and promotions | Sales strategy |
| Shipping rules by zone | Real-world checkout pricing |

## Phase 5 - Customer Experience

Complexity: Medium

| Task | Why it matters |
| --- | --- |
| Saved addresses | Faster checkout |
| Wishlist persistence | Better user retention |
| Order tracking | Better post-purchase UX |
| Email templates | Professional communication |
| Product recommendations | Higher conversion |

## Phase 6 - Quality and Observability

Complexity: Medium

| Task | Why it matters |
| --- | --- |
| Frontend tests | Protects cart/checkout UX |
| Backend API tests | Protects contracts |
| Sentry integration | Production error visibility |
| Uptime monitoring | Detects outages |
| Performance budget | Keeps storefront fast |

## Suggested Next Step

The next best technical step is to add backend tests for:

1. Admin-only product creation.
2. Non-admin product creation denied.
3. Checkout fails with empty cart.
4. Checkout creates pending order.
5. Webhook approved changes order to paid.
6. Webhook rejected changes order to cancelled.

This gives the project a serious production foundation before adding more features.
