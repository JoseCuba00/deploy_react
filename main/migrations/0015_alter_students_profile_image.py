# Generated by Django 5.1 on 2024-11-21 10:48

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0014_alter_questions_answer_alter_questions_sentences_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="students",
            name="profile_image",
            field=models.ImageField(
                default="profileimages00/defaultImgProfile.png",
                upload_to="profileimages00/",
            ),
        ),
    ]
