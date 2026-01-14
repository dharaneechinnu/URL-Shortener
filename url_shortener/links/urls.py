from django.urls import path
from .views import (
    URLShortenerOperation,

    RedirectView,
 
)

urlpatterns = [
    path("urls/create/", URLShortenerOperation.as_view({"post": "create"}), name="create-url"),
    path("urls/list/", URLShortenerOperation.as_view({"get": "list"}), name="my-urls"),
    path("urls/<int:pk>/", URLShortenerOperation.as_view({"get": "retrieve"}), name="url-detail"),
    path("urls/<int:pk>/update/", URLShortenerOperation.as_view({"put": "update"}), name="url-update"),
    path("urls/<int:pk>/delete/", URLShortenerOperation.as_view({"delete": "destroy"}), name="url-delete"),
    path("<str:code>/", RedirectView.as_view(), name="redirect-url"),
    
]
