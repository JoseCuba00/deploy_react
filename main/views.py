from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import redirect
from . import serializers
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import mixins
from rest_framework.decorators import api_view
from django.http import HttpResponse
from rest_framework.decorators import api_view
from google.cloud import texttospeech
import logging
from rest_framework import generics
from django.http import Http404
from .models import Students, Module, Topics, Questions,Assignments,StudentQuestion,StudentAssignments,TheoreticalContent,StudentTheory
from user_visit.models import UserVisit
from django.contrib.auth.models import User
from rest_framework import status, views
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
import os
from django.conf import settings
from django.core.files.storage import default_storage
from django.http import JsonResponse
from langdetect import detect, DetectorFactory
import re

logger = logging.getLogger(__name__)
# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = serializers.MyTokenObtainPairSerializer

    
class StudentsList(generics.ListCreateAPIView):
    queryset = Students.objects.all()
    serializer_class = serializers.StudentsSerializer
    #permission_classes = [permissions.IsAuthenticated] # Solo mostrará los datos si se esta logeado como admin


class StudentsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Students.objects.all()
    serializer_class = serializers.StudentsSerializer
    #permission_classes = [permissions.IsAuthenticated]


class ModuleList(generics.ListCreateAPIView):
    queryset = Module.objects.all()
    serializer_class = serializers.ModuleSerializer
    #permission_classes = [permissions.IsAuthenticated,]  Solo mostrará los datos si se esta logeado como admin
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['student_id'] = self.request.GET.get('student_id')  # Pasar student_id al serializer
        return context
    
class AssignmentsUpdate(generics.UpdateAPIView):
    queryset = Assignments.objects.all()
    serializer_class = serializers.AssignmentsSerializerUpdate

class StudentAssignmentsUpdate(generics.UpdateAPIView):
    serializer_class = serializers.StudentAssignmentsUpdateSerializer
    def get_object(self):
        student_id = self.request.GET.get('student_id')
        assignment_id = self.kwargs['assignment_id']
        return get_object_or_404(StudentAssignments, assignments__id=assignment_id, student__id=student_id)

class QuestionsUpdate(generics.UpdateAPIView):
    queryset = StudentQuestion.objects.all()
    serializer_class = serializers.StudentQuestionSerializerUpdate

@api_view(['POST'])
def convert_text_to_speech(request):
    DetectorFactory.seed = 0

    text = request.data.get('text', '')
    
    if not text:
        return HttpResponse(status=400, content='Text is required')
    
    if not re.match(r'^[\u0400-\u04FF\s,.!?\'"()]+$', text): # si el texto no tiene letras latinas no ejecutar el codigo de Text-to-Speech
        client = texttospeech.TextToSpeechClient()
        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(language_code='es-ES', ssml_gender=texttospeech.SsmlVoiceGender.MALE)
        audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

        response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
        audio_content = response.audio_content

        return HttpResponse(audio_content, content_type='audio/mpeg')

    return HttpResponse(status=204) # Este codigo significa que la solicitud fue exitosa pero no hay contenido que devolver
    
    # Crear cliente de Text-to-Speech
    

class ChangePasswordView(generics.UpdateAPIView):

    queryset = Students.objects.all()
    serializer_class = serializers.ChangePasswordSerializer

class ProfileImageView(generics.ListCreateAPIView):
    serializer_class = serializers.StudentsSerializer
    def get_queryset(self):
        pk = self.request.GET.get('student_id')
        return Students.objects.filter(id=pk)


class ProfileDatesView(generics.ListCreateAPIView):
    serializer_class = serializers.UserVisitsSerializer
    def get_queryset(self):
        pk = self.request.GET.get('student_id')
        return UserVisit.objects.filter(id=pk)

class ProfileImageViewUpdate(generics.UpdateAPIView):
    queryset = Students.objects.all()
    serializer_class = serializers.StudentsSerializerUpdate

    
class StudentQuestionView(generics.ListCreateAPIView):

    def get(self, request, module_id, assignments_id):
        student_id = request.GET.get('student_id')

        # Obtener preguntas
        questions = StudentQuestion.objects.filter(
            question__assignments__id=assignments_id,
            student=student_id,
            question__assignments__topics__module__id=module_id
        )

        # Obtener teorías
        theories = StudentTheory.objects.filter(
            theory__assignment__id=assignments_id,
            student=student_id,
            theory__assignment__topics__module__id=module_id
        )

        # Serializar datos
        question_serializer = serializers.StudentQuestionSerializer(questions, many=True)
        theory_serializer = serializers.StudentTheorySerializer(theories, many=True)

        # Combinar resultados
        data = {
            "data": theory_serializer.data + question_serializer.data 
        }

        return Response(data, status=status.HTTP_200_OK)

    
class StudentTopicsListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = serializers.StudentTopicsSerializer

    def get_queryset(self):        
        pk = self.kwargs['pk']
        return Topics.objects.filter(module__id=pk)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['student_id'] = self.request.GET.get('student_id')  # Pasar student_id al serializer
        context['module_id'] = self.kwargs['pk']
        return context


class TheoryUpdate(generics.UpdateAPIView):
    queryset = StudentTheory.objects.all()
    serializer_class = serializers.StudentTheorySerializerUpdate


@csrf_exempt
def custom_upload_function(request):
    if request.method == 'POST' and request.FILES.get('upload'):
        upload = request.FILES['upload']
        upload_path = os.path.join( settings.MEDIA_ROOT, 'ckeditor', upload.name)
        
        with default_storage.open(upload_path, 'wb+') as destination:
            for chunk in upload.chunks():
                destination.write(chunk)
        
        # Construye la URL completa para el archivo subido
        file_url = f"https://127.0.0.1:8000{settings.MEDIA_URL}ckeditor/{upload.name}" # Ruta para acceder al archivo

        print(file_url)
        return JsonResponse({
            'uploaded': True,
            'url': file_url
        })
    return JsonResponse({'uploaded': False})