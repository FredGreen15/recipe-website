import requests
from django.core.cache import cache
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


@api_view(["GET"])
def search_recipes(request):
    ingredients = request.query_params.get("ingredients")
    if not ingredients:
        return Response({"error": "ingredients parameter is required"}, status=400)
    cache_key = f"search:{ingredients}"
    cached = cache.get(cache_key)
    if cached is not None:
        return Response(cached)

    url = f"https://www.themealdb.com/api/json/v1/1/filter.php?i={ingredients}"
    data = requests.get(url).json()
    meals = data.get("meals") or []
    result = [
        {"id": m["idMeal"], "name": m["strMeal"], "thumbnail": m["strMealThumb"]}
        for m in meals
    ]
    cache.set(cache_key, result, timeout=3600)
    return Response(result)
