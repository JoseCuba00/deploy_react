import logging
import typing
import datetime
import django.db
from django.utils.deprecation import MiddlewareMixin
from django.core.exceptions import MiddlewareNotUsed
from django.http import HttpRequest, HttpResponse
from django.utils import timezone
from main.models import Students
from user_visit.models import UserVisit

from .settings import DUPLICATE_LOG_LEVEL, RECORDING_BYPASS, RECORDING_DISABLED

logger = logging.getLogger(__name__)


@django.db.transaction.atomic
def save_user_visit(user_visit: UserVisit) -> None:
    """Save the user visit and handle db.IntegrityError."""
    try:
        user_visit.save()
    except django.db.IntegrityError:
        getattr(logger, DUPLICATE_LOG_LEVEL)(
            "Error saving user visit "
        )


class UserVisitMiddleware(MiddlewareMixin):
    """Middleware to record user visits."""

    def __init__(self, get_response: typing.Callable) -> None:
        if RECORDING_DISABLED:
            raise MiddlewareNotUsed("UserVisit recording has been disabled")
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> typing.Optional[HttpResponse]:
            
        studentId = request.GET.get('student_id')
        
        if studentId is None:
            return self.get_response(request)

        if RECORDING_BYPASS(request):
            return self.get_response(request)
        print(request.COOKIES)
        
        if not request.COOKIES.get("lastVisit"):
           user = Students.objects.filter(id=studentId).first()

           response = self.get_response(request)
           tomorrow = datetime.datetime.now() + datetime.timedelta(days = 1) # Para que la cookie se venza al otro dia a primera hora  
           tomorrow = datetime.datetime.replace(tomorrow, hour=0, minute=0, second=0)
           expires = datetime.datetime.strftime(tomorrow, "%a, %d-%b-%Y %H:%M:%S GMT")

           response.set_cookie("lastVisit", value=timezone.now(), expires=expires, path='/', secure=True, httponly=True, samesite='None')

           uv = UserVisit.objects.build(studentId, request, timezone.now())
           # Para evitar que se guarde doble cuando se haga la solicitud desde assignments.jsx, se que es una mala practica pero fue la unica solucion que encontre 
           if not UserVisit.objects.filter(user= user, timestamp__date=timezone.now()).exists(): 
                save_user_visit(uv)
            
           
           return response 
           
        
        return self.get_response(request)
