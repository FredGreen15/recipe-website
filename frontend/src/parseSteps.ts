function stripLabel(step: string): string {
  return step
    .replace(/^step\s+\d+[:\s]*/i, '')  // "Step 1 " or "STEP 1: "
    .replace(/^\d+\.\s*/, '')            // "1. "
    .trim()
}

export function parseSteps(instructions: string): string[] {
  // Double newline → paragraph format
  if (/\r?\n\r?\n/.test(instructions)) {
    return instructions.split(/\r?\n\r?\n/).map(stripLabel).filter(s => s)
  }

  // Step-label format: lines starting with "Step N" or "N."
  if (/^(step\s+\d+|\d+\.)/im.test(instructions)) {
    return instructions.split(/\r?\n/).map(stripLabel).filter(s => s)
  }

  // Fallback: single newline
  return instructions.split(/\r?\n/).map(stripLabel).filter(s => s)
}
