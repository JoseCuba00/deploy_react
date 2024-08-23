# Generated by Django 5.0.6 on 2024-07-24 10:02

import ckeditor.fields
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0004_remove_studentquestion_assignments_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="TheoreticalContent",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=200)),
                ("content", ckeditor.fields.RichTextField()),
                (
                    "assignment",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="contents",
                        to="main.assignments",
                    ),
                ),
            ],
        ),
    ]
