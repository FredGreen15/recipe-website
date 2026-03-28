import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchPage } from './SearchPage'
import { RecipeDetail } from './RecipeDetail'

const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => mockFetch.mockReset())

// Recipe cards must sit inside a grid container so CSS can reflow them
// into a single column on small screens.
test('recipe results are wrapped in a grid container', async () => {
  mockFetch.mockResolvedValue({
    json: async () => [
      { id: '1', name: 'Teriyaki Chicken', thumbnail: 'https://example.com/t.jpg' },
    ],
  })

  render(<SearchPage onSelectRecipe={() => {}} />)
  await userEvent.type(screen.getByPlaceholderText(/ingredients/i), 'chicken')
  await userEvent.click(screen.getByRole('button', { name: /search/i }))
  await waitFor(() => screen.getByText('Teriyaki Chicken'))

  expect(document.querySelector('.recipe-grid')).toBeInTheDocument()
})

// The search form should stretch to fill the available width on mobile,
// not be a fixed pixel width that overflows.
test('search form has a full-width container class', () => {
  render(<SearchPage onSelectRecipe={() => {}} />)
  expect(document.querySelector('.search-form')).toBeInTheDocument()
})

// Recipe thumbnail images must not have inline fixed widths — they need
// to be controlled by CSS so they shrink on small screens.
test('recipe thumbnail has no inline width attribute', async () => {
  mockFetch.mockResolvedValue({
    json: async () => [
      { id: '1', name: 'Teriyaki Chicken', thumbnail: 'https://example.com/t.jpg' },
    ],
  })

  render(<SearchPage onSelectRecipe={() => {}} />)
  await userEvent.type(screen.getByPlaceholderText(/ingredients/i), 'chicken')
  await userEvent.click(screen.getByRole('button', { name: /search/i }))
  await waitFor(() => screen.getByRole('img', { name: 'Teriyaki Chicken' }))

  const img = screen.getByRole('img', { name: 'Teriyaki Chicken' })
  expect(img).not.toHaveAttribute('width')
})

// The detail page needs a wrapper class for responsive padding and
// max-width so it doesn't stretch uncomfortably on large screens.
test('recipe detail has a content wrapper class', async () => {
  mockFetch.mockResolvedValue({
    json: async () => ({
      id: '1',
      name: 'Teriyaki Chicken',
      thumbnail: 'https://example.com/t.jpg',
      instructions: 'Cook it.',
      ingredients: [{ name: 'Chicken', measure: '500g' }],
    }),
  })

  render(<RecipeDetail recipeId="1" onBack={() => {}} />)
  await waitFor(() => screen.getByText('Teriyaki Chicken'))

  expect(document.querySelector('.recipe-detail')).toBeInTheDocument()
})
