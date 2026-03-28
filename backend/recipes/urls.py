from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.health),
    path("recipes/", views.search_recipes),
]
