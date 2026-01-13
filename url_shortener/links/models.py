from django.db import models
from django.conf import settings



User = settings.AUTH_USER_MODEL
class Links(models.Model):

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    original_url = models.URLField()
    short_url = models.CharField(max_length=20, unique=True)
    clicks = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.short_url} -> {self.original_url}"