from django.contrib import admin
from .models import Student, Teacher, Module, Assignments, Topics, Choices, Questions, Sentences
# Register your models here.

admin.site.register(Student)
admin.site.register(Teacher)
admin.site.register(Module)
admin.site.register(Topics)
admin.site.register(Assignments)
admin.site.register(Choices)
admin.site.register(Questions)
admin.site.register(Sentences)
