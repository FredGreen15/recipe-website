import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchPage } from './SearchPage'

const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
})

// The search page must render an input and a button so the user can type
// ingredients and submit them.
test('renders ingredient input and search button', () => {
  render(<SearchPage />)
  expect(screen.getByPlaceholderText(/ingredients/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
})

// While the API is in flight the user should see a loading indicator
// so they know something is happening.
test('shows loading indicator while fetching', async () => {
  mockFetch.mockReturnValue(new Promise(() => {})) // never resolves

  render(<SearchPage />)
  await userEvent.type(screen.getByPlaceholderText(/ingredients/i), 'chicken')
  await userEvent.click(screen.getByRole('button', { name: /search/i }))

  expect(screen.getByText(/loading/i)).toBeInTheDocument()
})

// After a successful search, recipe cards should appear with name and thumbnail.
test('shows recipe cards after search', async () => {
  mockFetch.mockResolvedValue({
    json: async () => [
      { id: '1', name: 'Teriyaki Chicken', thumbnail: 'https://example.com/t.jpg' },
    ],
  })

  render(<SearchPage />)
  await userEvent.type(screen.getByPlaceholderText(/ingredients/i), 'chicken')
  await userEvent.click(screen.getByRole('button', { name: /search/i }))

  await waitFor(() => expect(screen.getByText('Teriyaki Chicken')).toBeInTheDocument())
  expect(screen.getByRole('img', { name: 'Teriyaki Chicken' })).toBeInTheDocument()
})

// When no recipes match the ingredients, show a friendly message
// instead of a blank screen.
test('shows empty state when no recipes found', async () => {
  mockFetch.mockResolvedValue({ json: async () => [] })

  render(<SearchPage />)
  await userEvent.type(screen.getByPlaceholderText(/ingredients/i), 'xyznotafood')
  await userEvent.click(screen.getByRole('button', { name: /search/i }))

  await waitFor(() =>
    expect(screen.getByText(/no recipes found/i)).toBeInTheDocument()
  )
})

// Pressing Enter should trigger the search — not just the button click.
test('pressing Enter triggers search', async () => {
  mockFetch.mockResolvedValue({
    json: async () => [
      { id: '1', name: 'Garlic Bread', thumbnail: 'https://example.com/g.jpg' },
    ],
  })

  render(<SearchPage />)
  await userEvent.type(screen.getByPlaceholderText(/ingredients/i), 'garlic{Enter}')

  await waitFor(() => expect(screen.getByText('Garlic Bread')).toBeInTheDocument())
})
