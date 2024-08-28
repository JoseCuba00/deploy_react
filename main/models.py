from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from django_ckeditor_5.fields import CKEditor5Field

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
    profile_image = models.FileField(upload_to='profile_images/', default='profile_images/defaultImgProfile.png')
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
    assignments = models.ForeignKey(Assignments,  on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    sentences = models.ManyToManyField(Sentences)
    choices = models.ManyToManyField(Choices)
    answer = models.ManyToManyField(Choices, related_name='answer')
    isText = models.BooleanField()
    type = models.SmallIntegerField()
   
    def __str__(self):
        return self.title

class StudentAssignments(models.Model):
    student = models.ForeignKey(Students, on_delete=models.CASCADE)
    assignments = models.ForeignKey(Assignments, on_delete=models.CASCADE)
    completed = models.SmallIntegerField()
    def __str__(self):
        return self.assignments.title

class StudentQuestion(models.Model):
    student = models.ForeignKey(Students, on_delete=models.CASCADE, related_name='student')
    question = models.ForeignKey(Questions, on_delete=models.CASCADE, related_name='student_questions')
    completed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.question.title


class TheoreticalContent(models.Model):
    assignment = models.ForeignKey(Assignments, related_name='contents', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = CKEditor5Field('Text', config_name='extends')  # Cambiar a RichTextField para usar CKEditor
    
    def __str__(self):
        return self.title
    
class StudentTheory(models.Model):
    student = models.ForeignKey(Students, on_delete=models.CASCADE)
    theory = models.ForeignKey(TheoreticalContent, on_delete=models.CASCADE, related_name='student_theory')
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.theory.title

@receiver(post_save, sender=Students)
def create_student_assignments(sender, instance, created, **kwargs):
    if created:
        assignments = Assignments.objects.all()
        questions = Questions.objects.all()

        for assignment in assignments:
            StudentAssignments.objects.create(
                student=instance,
                assignments=assignment,
                completed=0
            )
        for question in questions:
            StudentQuestion.objects.create(
                student=instance,
                question=question,
                completed=False
            )
