import { useState } from 'react'

interface Recipe {
  id: string
  name: string
  thumbnail: string
}

interface Props {
  onSelectRecipe?: (id: string) => void
}

export function SearchPage({ onSelectRecipe }: Props = {}) {
  const [ingredients, setIngredients] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch() {
    if (!ingredients.trim()) return
    setLoading(true)
    setSearched(true)
    const res = await fetch(`/api/recipes/?ingredients=${encodeURIComponent(ingredients)}`)
    const data = await res.json()
    setRecipes(data)
    setLoading(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div>
      <input
        placeholder="Enter ingredients (e.g. chicken, garlic)"
        value={ingredients}
        onChange={e => setIngredients(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}

      {!loading && searched && recipes.length === 0 && (
        <p>No recipes found — try different ingredients</p>
      )}

      {!loading && recipes.map(recipe => (
        <div key={recipe.id} onClick={() => onSelectRecipe?.(recipe.id)} style={{ cursor: 'pointer' }}>
          <img src={recipe.thumbnail} alt={recipe.name} />
          <p>{recipe.name}</p>
        </div>
      ))}
    </div>
  )
}
