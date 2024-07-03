from django.db import models

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

class Student(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=100)
    address = models.TextField(null=True)

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
    order = models.SmallIntegerField()
    type = models.SmallIntegerField()
    completed = models.BooleanField()
    
    def __str__(self):
        return self.title


