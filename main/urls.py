from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.contrib import admin
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('home', views.ModuleList.as_view()),
    path('students', views.StudentsList.as_view()),
    path('students/<int:pk>', views.StudentsDetail.as_view()),
    path('module/<int:pk>', views.StudentTopicsListCreateAPIView.as_view()),
    path('module/<int:module_id>/assignments/<int:assignments_id>', views.StudentQuestionView.as_view()),
    path('assignments/<int:assignment_id>', views.StudentAssignmentsUpdate.as_view()),
    path('questions_update/<int:pk>', views.QuestionsUpdate.as_view()),
    path('theory_update/<int:pk>', views.TheoryUpdate.as_view()),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('convert/', views.convert_text_to_speech, name='convert_text_to_speech'),
    path('account/change_password/<int:pk>', views.ChangePasswordView.as_view(), name='auth_change_password'),
    path('api/get_profile_image', views.ProfileImageView.as_view(), name='profile_image'),
    #path('api/get_profile_dates', views.get_class_schedule, name='profile_dates'),
    path('api/profile_image/<int:pk>', views.ProfileImageViewUpdate.as_view(), name='profile_image_update'),
    path("ckeditor5/", include('django_ckeditor_5.urls')), # Hay que agregar esto para que la biblioteca pueda pinchar bien 
    path("upload/", views.custom_upload_function, name="custom_upload_file"),
    path("translate/", views.translate_text),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
