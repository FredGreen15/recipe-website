import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecipeDetail } from './RecipeDetail'

const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
})

const MOCK_DETAIL = {
  id: '52772',
  name: 'Teriyaki Chicken',
  thumbnail: 'https://example.com/teriyaki.jpg',
  instructions: 'Mix sauce. Cook chicken. Serve.',
  ingredients: [
    { name: 'Chicken', measure: '500g' },
    { name: 'Soy Sauce', measure: '3 tbsp' },
  ],
}

// While the recipe is loading, show a spinner so the user isn't staring at a blank screen.
test('shows loading state while fetching', () => {
  mockFetch.mockReturnValue(new Promise(() => {})) // never resolves

  render(<RecipeDetail recipeId="52772" onBack={() => {}} />)

  expect(screen.getByText(/loading/i)).toBeInTheDocument()
})

// The back button lets the user return to the search results without losing them.
test('calls onBack when back button is clicked', async () => {
  mockFetch.mockResolvedValue({ json: async () => MOCK_DETAIL })
  const onBack = vi.fn()

  render(<RecipeDetail recipeId="52772" onBack={onBack} />)
  await waitFor(() => screen.getByText('Teriyaki Chicken'))
  await userEvent.click(screen.getByRole('button', { name: /back/i }))

  expect(onBack).toHaveBeenCalledOnce()
})

// The detail page fetches and displays everything the user needs to cook:
// name, thumbnail, each ingredient with its measurement, and the instructions.
test('shows full recipe details', async () => {
  mockFetch.mockResolvedValue({ json: async () => MOCK_DETAIL })

  render(<RecipeDetail recipeId="52772" onBack={() => {}} />)

  await waitFor(() => expect(screen.getByText('Teriyaki Chicken')).toBeInTheDocument())
  expect(screen.getByRole('img', { name: 'Teriyaki Chicken' })).toBeInTheDocument()
  expect(screen.getByText('Mix sauce. Cook chicken. Serve.')).toBeInTheDocument()
  expect(screen.getByText('Chicken — 500g')).toBeInTheDocument()
  expect(screen.getByText('Soy Sauce — 3 tbsp')).toBeInTheDocument()
})
