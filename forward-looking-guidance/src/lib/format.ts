/** Scores as the paper prints them: three decimals without the leading zero (".375"). */
export const score = (value: number) => value.toFixed(3).replace(/^0/, '').replace(/^-0/, '−')

/** A signed change in the same style ("+.087", "−.035", "±.000"). */
export function delta(value: number): string {
  const rounded = Math.round(value * 1000) / 1000
  if (rounded === 0) return '±.000'
  return `${rounded > 0 ? '+' : '−'}${Math.abs(rounded).toFixed(3).replace(/^0/, '')}`
}

/** "2,563" */
export const int = (value: number) => value.toLocaleString('en-US')

/** "+29.9%" */
export const percent = (value: number, digits = 1) => `${value >= 0 ? '+' : '−'}${Math.abs(value * 100).toFixed(digits)}%`
