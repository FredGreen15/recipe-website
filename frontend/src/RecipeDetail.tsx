import { useState, useEffect } from 'react'
import { parseSteps } from './parseSteps'
import { StepList } from './StepList'
import { scaleAmount } from './scaleAmount'

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
  const [servings, setServings] = useState(2)

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL ?? ''
    fetch(`${base}/api/recipes/${recipeId}/`)
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
      <div className="servings-selector">
        <label htmlFor="servings">Servings:</label>
        <select
          id="servings"
          value={servings}
          onChange={e => setServings(Number(e.target.value))}
        >
          {[1,2,3,4,5,6].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      <ul className="ing-list">
        {recipe.ingredients.map((ing, i) => (
          <li key={i} className="ing-row">
            <strong className="ing-name">{ing.name}</strong>
            <span className="ing-amount">{scaleAmount(ing.measure, servings / 2)}</span>
          </li>
        ))}
      </ul>
      <StepList steps={parseSteps(recipe.instructions)} />
    </div>
  )
}
