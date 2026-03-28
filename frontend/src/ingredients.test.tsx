import { render, screen } from '@testing-library/react'
import { RecipeDetail } from './RecipeDetail'

const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => mockFetch.mockReset())

const MOCK_RECIPE = {
  id: '1',
  name: 'Test Recipe',
  thumbnail: 'https://example.com/img.jpg',
  instructions: 'Cook it.',
  ingredients: [
    { name: 'Chicken', measure: '500g' },
    { name: 'Garlic', measure: 'to taste' },
  ],
}

// Ingredient name must be bold so it stands out when scanning the list.
test('ingredient name is rendered in a strong element', async () => {
  mockFetch.mockResolvedValue({ json: async () => MOCK_RECIPE })
  render(<RecipeDetail recipeId="1" onBack={() => {}} />)
  await screen.findByText('Test Recipe')
  const strong = document.querySelector('.ing-name')
  expect(strong).toBeInTheDocument()
})

// Ingredient amount gets a separate class so CSS can style it lighter.
test('ingredient amount has ing-amount class', async () => {
  mockFetch.mockResolvedValue({ json: async () => MOCK_RECIPE })
  render(<RecipeDetail recipeId="1" onBack={() => {}} />)
  await screen.findByText('Test Recipe')
  const amounts = document.querySelectorAll('.ing-amount')
  expect(amounts.length).toBe(2)
})
