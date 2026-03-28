import { parseSteps } from './parseSteps'

// Some recipes use "Step N" or "1." labels. We strip them and re-number in the UI.
test('splits step-label instructions and strips the labels', () => {
  const input = 'Step 1 Heat the oil.\nStep 2 Add the chicken.\nStep 3 Serve hot.'
  expect(parseSteps(input)).toEqual([
    'Heat the oil.',
    'Add the chicken.',
    'Serve hot.',
  ])
})

test('strips numeric "1." style labels', () => {
  const input = '1. Heat the oil.\n2. Add the chicken.\n3. Serve hot.'
  expect(parseSteps(input)).toEqual([
    'Heat the oil.',
    'Add the chicken.',
    'Serve hot.',
  ])
})

// Fallback: plain single-newline separated steps (no labels, no blank lines)
test('falls back to single newline when no other format detected', () => {
  const input = 'Heat the oil.\nAdd the chicken.\nServe hot.'
  expect(parseSteps(input)).toEqual([
    'Heat the oil.',
    'Add the chicken.',
    'Serve hot.',
  ])
})

// Empty lines must be filtered so we don't render blank steps.
test('filters out empty lines', () => {
  const input = 'Heat the oil.\n\nAdd the chicken.\n\nServe hot.'
  const result = parseSteps(input)
  expect(result).toHaveLength(3)
  expect(result).not.toContain('')
})

// TheMealDB uses \n only in some recipes — must work without \r
test('handles \\n only line endings', () => {
  const input = 'Heat the oil.\n\nAdd the chicken.'
  expect(parseSteps(input)).toEqual(['Heat the oil.', 'Add the chicken.'])
})

// Double newline is the most common TheMealDB format — paragraphs separated
// by a blank line. Each paragraph becomes one step.
test('splits double-newline instructions into steps', () => {
  const input = 'Heat the oil.\r\n\r\nAdd the chicken.\r\n\r\nServe hot.'
  expect(parseSteps(input)).toEqual([
    'Heat the oil.',
    'Add the chicken.',
    'Serve hot.',
  ])
})
