from django.urls import path
from .views import (
    CreateShortURLView,
    MyUrlsListView,
    RedirectView,
    URLDetailView,
    URLUpdateView,
    URLDeleteView,
)

urlpatterns = [
    path("urls/create/", CreateShortURLView.as_view(), name="create-url"),
    path("urls/list/", MyUrlsListView.as_view(), name="my-urls"),
    path("urls/<int:pk>/", URLDetailView.as_view(), name="url-detail"),
    path("urls/<int:pk>/update/", URLUpdateView.as_view(), name="url-update"),
    path("urls/<int:pk>/delete/", URLDeleteView.as_view(), name="url-delete"),
    path("<str:code>/", RedirectView.as_view(), name="redirect-url"),
    
]
