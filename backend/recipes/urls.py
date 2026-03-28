from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.health),
    path("recipes/", views.search_recipes),
    path("recipes/<str:meal_id>/", views.recipe_detail),
]
