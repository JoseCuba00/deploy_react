from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import redirect
from . import serializers
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view
from django.http import HttpResponse
from google.cloud import texttospeech
import logging
from rest_framework import generics
from .models import Students, Module, Topics, Questions,Assignments,StudentQuestion,StudentAssignments,TheoreticalContent,StudentTheory
from googletrans import Translator
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
from datetime import date, timedelta
from django.http import JsonResponse
from .models import ClassSchedule
from elevenlabs.client import ElevenLabs
import requests
import boto3 # Biblioteca para subir archivos a Yandex S3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
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


        client = ElevenLabs(
        api_key= settings.ELEVEN_LABS_KEY # Defaults to ELEVEN_API_KEY
        )
        audio = client.generate(
                text=text,
                voice="Liam",
                model="eleven_multilingual_v2",
                stream=True
                )

        return HttpResponse(audio, content_type='audio/mpeg')

    return HttpResponse(status=204) # Este codigo significa que la solicitud fue exitosa pero no hay contenido que devolver
    
    # Crear cliente de Text-to-Speech
    

@api_view(['POST'])
def translate_text(request):

    text = request.data.get('text', '')
    
    url = "https://translate.api.cloud.yandex.net/translate/v2/translate"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Api-Key {settings.YANDEX_TRANSLATE_KEY}",
       
    }
    data = {
        "sourceLanguageCode": "es",
        "targetLanguageCode": "ru",
        "texts": [text]
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()  # Lanza un error si la respuesta es un error HTTP

        translated_data = response.json()
        
    except requests.exceptions.RequestException as e:
        print(f"Error al traducir: {e}")
    

    data = translated_data['translations'][0]['text']
    
    return JsonResponse({text:data}) # Este codigo significa que la solicitud fue exitosa pero no hay contenido que devolver
    
class ChangePasswordView(generics.UpdateAPIView):

    queryset = Students.objects.all()
    serializer_class = serializers.ChangePasswordSerializer

class ProfileImageView(generics.ListCreateAPIView):
    serializer_class = serializers.StudentsSerializer
    def get_queryset(self):
        pk = self.request.GET.get('student_id')
        return Students.objects.filter(id=pk)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['student_id'] = self.request.GET.get('student_id')  # Pasar student_id al serializer
        return context



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
        file_name = upload.name

        session = boto3.session.Session(
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )

        s3 = session.client(
            service_name='s3',
            endpoint_url=settings.AWS_S3_ENDPOINT_URL
        )

        try:
            # Subir el archivo a Yandex Object Storage
            s3.upload_fileobj(upload, settings.AWS_STORAGE_BUCKET_NAME, file_name)
            # Construir la URL del archivo subido
            file_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{file_name}"

            return JsonResponse({
                'uploaded': True,
                'url': file_url
            })
        except (NoCredentialsError, PartialCredentialsError) as e:
            return JsonResponse({
                'uploaded': False,
                'error': str(e)
            })
    return JsonResponse({'uploaded': False})