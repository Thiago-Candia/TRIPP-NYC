from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0004_alter_category_id_alter_product_id_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="product",
            name="sku",
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name="productvariant",
            name="sku",
            field=models.CharField(blank=True, max_length=50, null=True, unique=True),
        ),
    ]
