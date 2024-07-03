from rest_framework import serializers
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from . import models 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User


class AssignmentsSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField() # Permite incluir campos calculados o propiedades en el Serializer

    class Meta:
        model = models.Assignments
        fields = '__all__'
    
    def get_total(self, obj): # esta propiedad debe tener el nombre get_<variable con el serializer del campo calculado>
        return obj.assignments.count()

class AssignmentsSerializerUpdate(serializers.ModelSerializer):
    class Meta:
        model = models.Assignments
        fields = ['id','completed']


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Student
        fields = ['id','full_name', 'email', 'password', 'phone_number', 'address']

class ModuleSerializer(serializers.ModelSerializer):
    first_id = serializers.SerializerMethodField()  
    class Meta:
        model = models.Module
        fields = ['id','title','description','first_id']

    def get_first_id(self, obj):
        first_topic = obj.module.first()  # Obtiene el primer tópico del módulo
        if first_topic:
            first_assignment = first_topic.assignments.first()  # Obtiene el primer assignment del tópico
            if first_assignment:
                return first_assignment.id
        return None
    
    def check_user(self,clean_data):
        user = authenticate(username=clean_data['email'],password= clean_data['password'])

        if not user:
            raise ValidationError('no encontrado')


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
        model = models.Questions
        fields = ['id','completed']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer): # Para que en el token este en username
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token
    
class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, )
    class Meta:
        model = User
        fields = ('password',)

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()

        return instance