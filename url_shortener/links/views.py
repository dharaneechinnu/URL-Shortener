from django.shortcuts import get_object_or_404, redirect
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import F
from .models import Links
from .serializers import   ShortURLListSerializer


class URLShortenerOperation(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ShortURLListSerializer
    lookup_field = "pk"
    
    def get_queryset(self):
        return Links.objects.filter(user=self.request.user)

class RedirectView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, code):
        url = get_object_or_404(Links, short_url=code, is_active=True)
        Links.objects.filter(pk=url.pk).update(clicks=F("clicks") + 1)
        return redirect(url.original_url)

