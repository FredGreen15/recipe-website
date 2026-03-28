export function scaleAmount(measure: string, factor: number): string {
  const match = measure.match(/^(\d+\.?\d*)(.*)$/)
  if (!match) return measure
  const num = parseFloat(match[1]) * factor
  const unit = match[2]
  const formatted = Number.isInteger(num) ? String(num) : num.toFixed(1)
  return formatted + unit
}
