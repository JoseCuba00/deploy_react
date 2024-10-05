from rest_framework import serializers
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from . import models 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from datetime import date, timedelta
from django.http import JsonResponse
from .models import ClassSchedule

class AssignmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Assignments
        fields = '__all__'


class AssignmentsSerializerUpdate(serializers.ModelSerializer):
    class Meta:
        model = models.Assignments
        fields = ['id','completed']


class StudentsSerializer(serializers.ModelSerializer):
    user_visits = serializers.SerializerMethodField()
        
    class Meta:
        model = models.Students
        fields = ['username','email','phone_number','profile_image','user_visits']
    
    def get_user_visits(self, obj):
        student_id = self.context.get('student_id')
        schedules = ClassSchedule.objects.filter(student_id=student_id)
        current_date = date.today()
        end_date = current_date + timedelta(days=60)  # Puedes ajustar el rango de fechas según necesites
        class_dates = []

        while current_date <= end_date:
            for schedule in schedules:
                for day in schedule.day_of_week.all():  # Iterar sobre los días de la semana
                    if current_date.strftime('%A') == day.title:  # Comparar el nombre del día
                        class_dates.append(current_date.isoformat())
            current_date += timedelta(days=1)

        return class_dates

    
class StudentsSerializerUpdate(serializers.ModelSerializer):
    class Meta:
        model = models.Students
        fields = ['profile_image']



class TopicsSerializer(serializers.ModelSerializer):
    assignments = AssignmentsSerializer(many=True, read_only=True)
    class Meta:
        model = models.Topics
        fields = ['id','title','assignments']


        
class ChoicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Choices
        fields = ['id','title']

class SentencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Sentences
        fields = ['title']


class QuestionsSerializer(serializers.ModelSerializer):
    choices = ChoicesSerializer(many=True, read_only=True)
    sentences = SentencesSerializer(many=True, read_only=True)

    class Meta:
        model = models.Questions
        fields = '__all__'


class QuestionsSerializerUpdate(serializers.ModelSerializer):
    class Meta:
        model = models.StudentQuestion
        fields = ['id','completed']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer): # Para que en el token este en username
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['id'] = user.id
        return token
    

class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, )
    class Meta:
        model = models.Students
        fields = ('password',)

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()

        return instance

class StudentQuestionSerializer(serializers.ModelSerializer):
    question = QuestionsSerializer()
    class Meta:
        model = models.StudentQuestion
        fields = ["id","completed","question","student"]

class StudentQuestionSerializerUpdate(serializers.ModelSerializer):
    class Meta:
        model = models.StudentQuestion
        fields = ['id','completed']

class StudentAssignmentsSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField() # Permite incluir campos calculados o propiedades en el Serializer
    assignments = AssignmentsSerializer()
    class Meta:
        model = models.StudentAssignments
        fields = ["completed","student","assignments","total"]
    
    def get_total(self, obj): # esta propiedad debe tener el nombre get_<variable con el serializer del campo calculado>

        student_id = self.context.get('student_id') 
        questions = models.StudentQuestion.objects.filter(question__assignments__id = obj.assignments.id,
                                                          student__id = student_id )
        
        return len(questions)

class StudentAssignmentsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StudentAssignments
        fields = ["completed"]
    

    
class StudentTopicsSerializer(serializers.ModelSerializer):
    assignments = serializers.SerializerMethodField()
    
    class Meta:
        model = models.Topics
        fields = ['id', 'title', 'assignments']

    def get_assignments(self, topic):
        student_id = self.context.get('student_id')  # Get student_id from context
        module_id = self.context.get('module_id')
        
        #  Conseguir todos los assignments para dicho estudiante y dicho modulo 
        assignments = models.StudentAssignments.objects.filter(
            student=student_id, 
            assignments__topics=topic,
            assignments__topics__module__id=module_id
        )
        
        # Serializar los assignments
        serializer = StudentAssignmentsSerializer(instance=assignments, many=True, context={'student_id': student_id})
        return serializer.data
    
class ModuleSerializer(serializers.ModelSerializer):
    first_id = serializers.SerializerMethodField()  
    topics = serializers.SerializerMethodField()
    class Meta:
        model = models.Module
        fields = ['id','title','description','first_id','topics']

    def get_first_id(self, obj):
    
        first_topic = obj.module.first()  # Obtiene el primer topic del módulo
        if first_topic:
            first_assignment = first_topic.assignments.first()  # Obtiene el primer assignment del topic
            if first_assignment:
                return first_assignment.id
        return None
    
    
    def get_topics(self,obj):
        
        student_id = self.context.get('student_id')  # Get student_id from context
        assignments = models.StudentAssignments.objects.filter(
            student=student_id, 
            assignments__topics__module_id=obj.id
        )
        serializer = StudentAssignmentsSerializer(instance=assignments, many=True, context={'student_id': student_id})
        return serializer.data

class TheorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TheoreticalContent
        fields = '__all__'

class StudentTheorySerializer(serializers.ModelSerializer):
    theory = TheorySerializer()
    class Meta:
        model = models.StudentTheory
        fields = '__all__'

class StudentTheorySerializerUpdate(serializers.ModelSerializer):
    class Meta:
        model = models.StudentTheory
        fields = ['id','completed']
       






