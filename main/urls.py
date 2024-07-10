from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

urlpatterns = [
    path('students', views.StudentsList.as_view()),
    path('students/<int:pk>', views.StudentsDetail.as_view()),
    path('', views.ModuleList.as_view()),
    path('module/<int:pk>', views.TopicsList.as_view()),
    path('module/<int:module_id>/assignments/<int:assignments_id>', views.QuestionsList.as_view()),
    path('assignments/<int:pk>', views.AssignmentsUpdate.as_view()),
    path('questions_update/<int:pk>', views.QuestionsUpdate.as_view()),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('convert/', views.convert_text_to_speech, name='convert_text_to_speech'),
    path('account/change_password/<int:pk>', views.ChangePasswordView.as_view(), name='auth_change_password'),
    path('api/get_profile_image/<int:student>', views.ProfileImageView.as_view(), name='profile_image'),
    path('api/profile_image/<int:pk>', views.ProfileImageViewUpdate.as_view(), name='profile_image'),

]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) # Para poder cargar las imagenes desde el navegador