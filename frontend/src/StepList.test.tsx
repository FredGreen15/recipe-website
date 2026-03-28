import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StepList } from './StepList'

const STEPS = ['Heat the oil.', 'Add the chicken.', 'Serve hot.']

// Uncompleted steps must not have the done class.
test('uncompleted steps do not have step-done class', () => {
  render(<StepList steps={STEPS} />)
  expect(screen.getByText('Heat the oil.').closest('.step-item')).not.toHaveClass('step-done')
})

// Tapping again un-checks — recovers from accidental taps.
test('tapping a completed step un-checks it', async () => {
  render(<StepList steps={STEPS} />)
  await userEvent.click(screen.getByText('Heat the oil.'))
  await userEvent.click(screen.getByText('Heat the oil.'))
  expect(screen.getByText('Heat the oil.').closest('.step-item')).not.toHaveClass('step-done')
})

// Tapping a step should mark it complete — a checkmark appears.
test('tapping a step marks it complete', async () => {
  render(<StepList steps={STEPS} />)
  await userEvent.click(screen.getByText('Heat the oil.'))
  expect(screen.getByText('Heat the oil.').closest('.step-item')).toHaveClass('step-done')
})
