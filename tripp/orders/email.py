"""
orders/email.py

Email notifications for orders.

Development:   EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
Production:    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
               (configure SENDGRID_* env vars — see settings.py)
"""

from django.core.mail import send_mail
from django.conf import settings


def send_order_confirmation(order):
    """Send a plain-text order confirmation to the customer."""
    subject = f"Order Confirmed — TRIPP NYC #{order.id}"

    # Build item lines
    item_lines = "\n".join(
        f"  {item.quantity} × {item.name}  ${item.subtotal:.2f}"
        for item in order.items.all()
    )

    shipping_display = "FREE" if order.shipping_cost == 0 else f"${order.shipping_cost:.2f}"

    body = f"""
Hi {order.first_name},

Your order #{order.id} has been confirmed. Thank you for shopping at TRIPP NYC!

─────────────────────────────────────
ORDER SUMMARY
─────────────────────────────────────
{item_lines}

Subtotal:  ${order.subtotal:.2f}
Shipping:  {shipping_display}
Total:     ${order.total:.2f} ARS
─────────────────────────────────────

SHIPPING TO:
{order.full_name}
{order.address_line1}{f', {order.address_line2}' if order.address_line2 else ''}
{order.city}, {order.state} {order.zip_code}
{order.country}

Questions? Reply to this email or contact us at support@trippnyc.com

– The TRIPP NYC Team
""".strip()

    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.email],
            fail_silently=False,
        )
    except Exception as exc:
        # Log but don't break the checkout flow
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to send order confirmation for order #{order.id}: {exc}")
