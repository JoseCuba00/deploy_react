# Generated by Django 5.1 on 2024-08-28 11:30

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0006_alter_theoreticalcontent_content_studenttheory"),
    ]

    operations = [
        migrations.AlterField(
            model_name="students",
            name="profile_image",
            field=models.FileField(
                default="profile_images/defaultImgProfile.png",
                upload_to="profile_images/",
            ),
        ),
    ]