# Generated by Django 5.0.6 on 2024-07-22 07:44

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("user_visit", "0004_uservisit_browser_uservisit_device_uservisit_os"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="uservisit",
            name="session_key",
        ),
    ]
