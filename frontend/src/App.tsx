import { useState } from 'react'
import { SearchPage } from './SearchPage'
import { RecipeDetail } from './RecipeDetail'

function App() {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)

  return selectedRecipeId
    ? <RecipeDetail recipeId={selectedRecipeId} onBack={() => setSelectedRecipeId(null)} />
    : <SearchPage onSelectRecipe={setSelectedRecipeId} />
}

export default App
