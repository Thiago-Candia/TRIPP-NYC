from .models import Cart
from users.models import CustomUser


def get_or_create_cart(request):
    user = getattr(request, "user", None)
    if user and user.is_authenticated:
        if isinstance(user, CustomUser):
            cart, _ = Cart.objects.get_or_create(user=user)
        else:
            cart, _ = Cart.objects.get_or_create(auth_user=user)
        return cart

    session_id = request.session.session_key
    if not session_id:
        request.session.create()
        session_id = request.session.session_key

    cart, _ = Cart.objects.get_or_create(session_id=session_id)
    return cart
