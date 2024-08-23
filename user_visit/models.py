from __future__ import annotations
from main.models import Students
import datetime
import uuid

import user_agents
from django.conf import settings
from django.db import models
from django.http import HttpRequest
from django.utils import timezone
from django.utils.translation import gettext_lazy as _lazy
from main.models import Students


def parse_remote_addr(request: HttpRequest) -> str:
    """Extract client IP from request."""
    x_forwarded_for = request.headers.get("X-Forwarded-For", "")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0]
    return request.META.get("REMOTE_ADDR", "")


def parse_ua_string(request: HttpRequest) -> str:
    """Extract client user-agent from request."""
    return request.headers.get("User-Agent", "")


class UserVisitManager(models.Manager):
    """Custom model manager for UserVisit objects."""

    def build(self, studenId, request: HttpRequest, timestamp: datetime.datetime) -> UserVisit:
        """Build a new UserVisit object from a request, without saving it."""
        user = Students.objects.filter(id=studenId).first()
       
        uv = UserVisit(
            user=user,
            timestamp=timestamp,
            remote_addr=parse_remote_addr(request),
            ua_string=parse_ua_string(request),
        )
        uv.browser = uv.user_agent.get_browser()[:200]
        uv.device = uv.user_agent.get_device()[:200]
        uv.os = uv.user_agent.get_os()[:200]
        return uv


class UserVisit(models.Model):
    """
    Record of a user visiting the site on a given day.

    This is used for tracking and reporting - knowing the volume of visitors
    to the site, and being able to report on someone's interaction with the site.

    We record minimal info required to identify user sessions, plus changes in
    IP and device. This is useful in identifying suspicious activity (multiple
    logins from different locations).

    Also helpful in identifying support issues (as getting useful browser data
    out of users can be very difficult over live chat).

    """

    user = models.ForeignKey(
        Students, related_name="user_visits", on_delete=models.CASCADE
    )
    timestamp = models.DateTimeField(
        help_text=_lazy("The time at which the first visit of the day was recorded"),
        default=timezone.now,
    )
    
    remote_addr = models.CharField(
        help_text=_lazy(
            "Client IP address (from X-Forwarded-For HTTP header, "
            "or REMOTE_ADDR request property)"
        ),
        max_length=100,
        blank=True,
    )
    ua_string = models.TextField(
        _lazy("User agent (raw)"),
        help_text=_lazy("Client User-Agent HTTP header"),
        blank=True,
    )
    browser = models.CharField(
        max_length=200,
        blank=True,
        default="",
    )
    device = models.CharField(
        _lazy("Device type"),
        max_length=200,
        blank=True,
        default="",
    )
    os = models.CharField(
        _lazy("Operating System"),
        max_length=200,
        blank=True,
        default="",
    )
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    created_at = models.DateTimeField(
        help_text=_lazy(
            "The time at which the database record was created (!=timestamp)"
        ),
        auto_now_add=True,
    )

    objects = UserVisitManager()

    class Meta:
        get_latest_by = "timestamp"

    def __str__(self) -> str:
        return f"{self.user} visited the site on {self.timestamp}"

    def __repr__(self) -> str:
        return f"<UserVisit id={self.id} user_id={self.user_id} date='{self.date}'>"


    @property
    def user_agent(self) -> user_agents.parsers.UserAgent:
        """Return UserAgent object from the raw user_agent string."""
        return user_agents.parsers.parse(self.ua_string)

    @property
    def date(self) -> datetime.date:
        """Extract the date of the visit from the timestamp."""
        return self.timestamp.date()


