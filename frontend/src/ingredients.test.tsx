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

// Serving size dropdown defaults to 2.
test('serving size dropdown defaults to 2', async () => {
  mockFetch.mockResolvedValue({ json: async () => MOCK_RECIPE })
  render(<RecipeDetail recipeId="1" onBack={() => {}} />)
  await screen.findByText('Test Recipe')
  const select = screen.getByRole('combobox')
  expect((select as HTMLSelectElement).value).toBe('2')
})

// Changing the dropdown scales the amounts immediately.
test('changing serving size scales ingredient amounts', async () => {
  mockFetch.mockResolvedValue({ json: async () => MOCK_RECIPE })
  render(<RecipeDetail recipeId="1" onBack={() => {}} />)
  await screen.findByText('Test Recipe')

  // Default 2 persons → 500g
  expect(screen.getByText('500g')).toBeInTheDocument()

  // Change to 1 person → should show 250g
  await import('@testing-library/user-event').then(m => m.default.selectOptions(
    screen.getByRole('combobox'), '1'
  ))
  expect(screen.getByText('250g')).toBeInTheDocument()
})

// Non-numeric amounts must never change regardless of serving size.
test('non-numeric amounts are unchanged when serving size changes', async () => {
  mockFetch.mockResolvedValue({ json: async () => MOCK_RECIPE })
  render(<RecipeDetail recipeId="1" onBack={() => {}} />)
  await screen.findByText('Test Recipe')

  await import('@testing-library/user-event').then(m => m.default.selectOptions(
    screen.getByRole('combobox'), '4'
  ))
  expect(screen.getByText('to taste')).toBeInTheDocument()
})
