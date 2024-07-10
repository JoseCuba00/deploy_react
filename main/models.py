from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Teacher(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=100)
    address = models.TextField(null=True)

class Module(models.Model):
    title=models.CharField(max_length=150)
    description = models.TextField(null=True)
    def __str__(self):
        return self.title

class Topics(models.Model):
    module = models.ForeignKey(Module,related_name='module', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    def __str__(self):
        return self.title

class Students(AbstractUser): # Heredar la clase User
    phone_number = models.CharField(max_length=12)
    profile_image = models.ImageField(upload_to='profile_images/', default='profile_images/defaultImgProfile.png')
    class Meta:
        db_table = "Students"

class Visit(models.Model):
    user = models.ForeignKey(Students, on_delete=models.CASCADE)
    date = models.DateField()

    def __str__(self):
        return f"{self.user.username} visited on {self.date}"

class Assignments(models.Model):
    title = models.CharField(max_length=150)
    topics = models.ForeignKey(Topics,related_name='assignments', on_delete=models.CASCADE)
    completed = models.SmallIntegerField()

    def __str__(self):
        return self.title
    
class Choices(models.Model):
    title = models.CharField(max_length=150)
    
    def __str__(self):
        return self.title

class Sentences(models.Model):
    title = models.TextField()
    
    def __str__(self):
        return self.title
    
class Questions(models.Model):
    title = models.CharField(max_length=150)
    sentences = models.ManyToManyField(Sentences)
    choices = models.ManyToManyField(Choices)
    answer = models.ManyToManyField(Choices, related_name='answer')
    assignments = models.ForeignKey(Assignments, related_name='assignments', on_delete=models.CASCADE) # se le pone related_name para poder "usar" este campo desde la clase Assignments
    isText = models.BooleanField()
    type = models.SmallIntegerField()
    completed = models.BooleanField()
    def __str__(self):
        return self.title







