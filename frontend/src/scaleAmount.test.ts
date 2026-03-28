import { scaleAmount } from './scaleAmount'

// Core behavior: multiply the numeric part, keep the unit.
test('scales a numeric amount with unit', () => {
  expect(scaleAmount('500g', 1.5)).toBe('750g')
})

// Number + text unit with a space (e.g. "3 tbsp")
test('scales amount with space before unit', () => {
  expect(scaleAmount('3 tbsp', 0.5)).toBe('1.5 tbsp')
})

// Number only, no unit
test('scales a bare number', () => {
  expect(scaleAmount('3', 2)).toBe('6')
})

// Non-numeric amounts must pass through unchanged — "to taste" cannot be scaled.
test('returns non-numeric amounts unchanged', () => {
  expect(scaleAmount('to taste', 2)).toBe('to taste')
  expect(scaleAmount('pinch', 0.5)).toBe('pinch')
})

// Factor of 1 means no change.
test('factor of 1 returns original amount', () => {
  expect(scaleAmount('500g', 1)).toBe('500g')
})

// Whole numbers must not show a decimal point.
test('formats whole numbers without decimals', () => {
  expect(scaleAmount('500g', 2)).toBe('1000g')
})

// Half-values should show exactly 1 decimal place.
test('formats non-whole numbers with 1 decimal place', () => {
  expect(scaleAmount('3 tbsp', 0.5)).toBe('1.5 tbsp')
})
