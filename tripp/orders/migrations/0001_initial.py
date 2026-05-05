import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("products", "0001_initial"),
        ("stores", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Order",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("customer_name", models.CharField(max_length=120)),
                ("total", models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ("status", models.CharField(default="pending", max_length=40)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("product", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="orders", to="products.product")),
                ("store", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="orders", to="stores.store")),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
