import { useState } from 'react'

interface Props {
  steps: string[]
}

export function StepList({ steps }: Props) {
  const [done, setDone] = useState<Set<number>>(new Set())

  function toggle(i: number) {
    setDone(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <ol className="step-list">
      {steps.map((step, i) => (
        <li
          key={i}
          className={`step-item${done.has(i) ? ' step-done' : ''}`}
          onClick={() => toggle(i)}
        >
          <span className="step-check">{done.has(i) ? '✓' : ''}</span>
          {step}
        </li>
      ))}
    </ol>
  )
}
