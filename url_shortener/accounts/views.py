from rest_framework.generics import CreateAPIView
from .serializers import RegisterSerializer

class Registerview(CreateAPIView):
    serializer_class = RegisterSerializer
