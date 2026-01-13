from django.shortcuts import get_object_or_404, redirect
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import F
from .models import Links
from .serializers import  ShortURLCreateSerializer, ShortURLListSerializer


class CreateShortURLView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShortURLCreateSerializer


class MyUrlsListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShortURLListSerializer
    
    def get_queryset(self):
        print("User:", self.request.user)
        return Links.objects.filter(user=self.request.user)


class URLDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShortURLListSerializer

    def get_queryset(self):
        return Links.objects.filter(user=self.request.user)

    


class URLUpdateView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShortURLListSerializer
    
    def get_queryset(self):
        return Links.objects.filter(user=self.request.user)


class URLDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Links.objects.filter(user=self.request.user)


class RedirectView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, code):
        url = get_object_or_404(Links, short_url=code, is_active=True)
        Links.objects.filter(pk=url.pk).update(clicks=F("clicks") + 1)
        return redirect(url.original_url)

