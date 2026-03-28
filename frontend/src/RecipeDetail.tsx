import { useState, useEffect } from 'react'

interface Ingredient {
  name: string
  measure: string
}

interface Recipe {
  id: string
  name: string
  thumbnail: string
  instructions: string
  ingredients: Ingredient[]
}

interface Props {
  recipeId: string
  onBack: () => void
}

export function RecipeDetail({ recipeId, onBack }: Props) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/recipes/${recipeId}/`)
      .then(res => res.json())
      .then(data => {
        setRecipe(data)
        setLoading(false)
      })
  }, [recipeId])

  if (loading) return <p>Loading...</p>
  if (!recipe) return <p>Recipe not found.</p>

  return (
    <div className="recipe-detail">
      <button onClick={onBack}>Back</button>
      <h1>{recipe.name}</h1>
      <img src={recipe.thumbnail} alt={recipe.name} />
      <ul>
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>{ing.name} — {ing.measure}</li>
        ))}
      </ul>
      <p>{recipe.instructions}</p>
    </div>
  )
}
