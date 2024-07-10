from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import redirect
from .serializers import StudentsSerializer, ModuleSerializer,TopicsSerializer,QuestionsSerializer,AssignmentsSerializer,AssignmentsSerializerUpdate,QuestionsSerializerUpdate,ChangePasswordSerializer,StudentsSerializerUpdate
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import mixins
from rest_framework.decorators import api_view
from django.http import HttpResponse
from rest_framework.decorators import api_view
from google.cloud import texttospeech
import logging
from rest_framework import generics
from django.http import Http404
from .models import Students, Module, Topics, Questions,Assignments
from django.contrib.auth.models import User
from rest_framework import status, views
from rest_framework.parsers import MultiPartParser, FormParser




logger = logging.getLogger(__name__)
# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    
class StudentsList(generics.ListCreateAPIView):
    queryset = Students.objects.all()
    serializer_class = StudentsSerializer
    #permission_classes = [permissions.IsAuthenticated] # Solo mostrará los datos si se esta logeado como admin


class StudentsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Students.objects.all()
    serializer_class = StudentsSerializer
    #permission_classes = [permissions.IsAuthenticated]


class ModuleList(generics.ListCreateAPIView):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    #permission_classes = [permissions.IsAuthenticated,] # Solo mostrará los datos si se esta logeado como admin
   

class TopicsList(generics.ListCreateAPIView):
    serializer_class = TopicsSerializer
    def get_queryset(self):
        pk = self.kwargs['pk']
        return Topics.objects.filter(module__id=pk)
    #permission_classes = [permissions.IsAuthenticated] # Solo mostrará los datos si se esta logeado como admin


class QuestionsList(generics.ListCreateAPIView):
    serializer_class = QuestionsSerializer

    def get_queryset(self):
        module_id = self.kwargs.get('module_id')
        assignments_id = self.kwargs.get('assignments_id')

        if not module_id or not assignments_id:
            raise Http404  # Lanza un 404 si los parámetros no están presentes

        topics = Topics.objects.filter(module=module_id)
        assignments = Assignments.objects.filter(id=assignments_id, topics__in=topics)
        
        questions = Questions.objects.filter(assignments__in=assignments)

        if not questions.exists():  # Verifica si el queryset está vacío
            raise Http404  # Lanza un 404 si no se encuentran preguntas

        return questions
    
class AssignmentsUpdate(generics.UpdateAPIView):
    queryset = Assignments.objects.all()
    serializer_class = AssignmentsSerializerUpdate

class QuestionsUpdate(generics.UpdateAPIView):
    queryset = Questions.objects.all()
    serializer_class = QuestionsSerializerUpdate

@api_view(['POST'])
def convert_text_to_speech(request):
    text = request.data.get('text', '')
    
    if not text:
        return HttpResponse(status=400, content='Text is required')
    
    # Crear cliente de Text-to-Speech
    client = texttospeech.TextToSpeechClient()
    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(language_code='es-ES', ssml_gender=texttospeech.SsmlVoiceGender.MALE)
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

    response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
    audio_content = response.audio_content

    return HttpResponse(audio_content, content_type='audio/mpeg')

class ChangePasswordView(generics.UpdateAPIView):

    queryset = Students.objects.all()
    serializer_class = ChangePasswordSerializer

class ProfileImageView(generics.ListCreateAPIView):
    serializer_class = StudentsSerializer
    def get_queryset(self):
        pk = self.kwargs['student']
        return Students.objects.filter(id=pk)
   

class ProfileImageViewUpdate(generics.UpdateAPIView):
    queryset = Students.objects.all()
    serializer_class = StudentsSerializerUpdate
