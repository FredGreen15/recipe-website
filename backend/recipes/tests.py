from unittest.mock import patch, Mock
from django.core.cache import cache
from django.test import TestCase


MEALDB_CHICKEN_RESPONSE = {
    "meals": [
        {"idMeal": "52772", "strMeal": "Teriyaki Chicken", "strMealThumb": "https://example.com/teriyaki.jpg"},
        {"idMeal": "52795", "strMeal": "Chicken Handi",    "strMealThumb": "https://example.com/handi.jpg"},
    ]
}


class HealthCheckTest(TestCase):
    # The health endpoint lets the frontend confirm the backend is running.
    def test_health_endpoint_returns_ok(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})


MEALDB_DETAIL_RESPONSE = {
    "meals": [{
        "idMeal": "52772",
        "strMeal": "Teriyaki Chicken",
        "strMealThumb": "https://example.com/teriyaki.jpg",
        "strInstructions": "Mix sauce. Cook chicken. Serve.",
        "strIngredient1": "Chicken", "strMeasure1": "500g",
        "strIngredient2": "Soy Sauce", "strMeasure2": "3 tbsp",
        "strIngredient3": "", "strMeasure3": "",
    }]
}


class RecipeDetailTest(TestCase):
    def setUp(self):
        cache.clear()

    # The core behavior: fetching a recipe by ID returns all the detail the user
    # needs to cook — name, thumbnail, instructions, and a clean ingredients list.
    @patch("recipes.views.requests.get")
    def test_detail_returns_full_recipe(self, mock_get):
        mock_get.return_value = Mock(json=lambda: MEALDB_DETAIL_RESPONSE)

        response = self.client.get("/api/recipes/52772/")

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["id"], "52772")
        self.assertEqual(data["name"], "Teriyaki Chicken")
        self.assertEqual(data["instructions"], "Mix sauce. Cook chicken. Serve.")
        self.assertEqual(data["ingredients"], [
            {"name": "Chicken",    "measure": "500g"},
            {"name": "Soy Sauce",  "measure": "3 tbsp"},
        ])


    # If TheMealDB doesn't know the ID, we return 404 so the frontend can handle it cleanly.
    @patch("recipes.views.requests.get")
    def test_detail_returns_404_for_unknown_id(self, mock_get):
        mock_get.return_value = Mock(json=lambda: {"meals": None})

        response = self.client.get("/api/recipes/99999/")

        self.assertEqual(response.status_code, 404)

    # Repeat fetches for the same recipe should come from cache — not TheMealDB.
    @patch("recipes.views.requests.get")
    def test_detail_uses_cache_on_repeat_calls(self, mock_get):
        mock_get.return_value = Mock(json=lambda: MEALDB_DETAIL_RESPONSE)

        self.client.get("/api/recipes/52772/")
        self.client.get("/api/recipes/52772/")

        mock_get.assert_called_once()


class RecipeSearchTest(TestCase):
    def setUp(self):
        cache.clear()

    # When TheMealDB returns no results (meals: null), the API should return an empty list
    # instead of an error, so the frontend can show a "no results" message gracefully.
    @patch("recipes.views.requests.get")
    def test_search_returns_empty_list_when_no_results(self, mock_get):
        mock_get.return_value = Mock(json=lambda: {"meals": None})

        response = self.client.get("/api/recipes/?ingredients=xyznotafood")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])

    # The ingredients param is required — without it we don't know what to search for.
    def test_search_returns_400_when_ingredients_missing(self):
        response = self.client.get("/api/recipes/")
        self.assertEqual(response.status_code, 400)

    # Repeat searches for the same ingredient should hit the cache, not TheMealDB again.
    # This keeps the app fast and avoids unnecessary external API calls.
    @patch("recipes.views.requests.get")
    def test_search_uses_cache_on_repeat_calls(self, mock_get):
        mock_get.return_value = Mock(json=lambda: MEALDB_CHICKEN_RESPONSE)

        self.client.get("/api/recipes/?ingredients=chicken")
        self.client.get("/api/recipes/?ingredients=chicken")

        mock_get.assert_called_once()

    # The core behavior: searching by ingredient returns a clean list of recipes
    # with id, name, and thumbnail — exactly what the frontend needs to render cards.
    @patch("recipes.views.requests.get")
    def test_search_returns_recipe_list(self, mock_get):
        mock_get.return_value = Mock(json=lambda: MEALDB_CHICKEN_RESPONSE)

        response = self.client.get("/api/recipes/?ingredients=chicken")

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0], {
            "id": "52772",
            "name": "Teriyaki Chicken",
            "thumbnail": "https://example.com/teriyaki.jpg",
        })
