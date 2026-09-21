/**
 * Types for the HeroField.
 */

// --- GLOBALS ---
/** A point in the field. */
export type HeroFieldNode = {
  x: number
  y: number
  r: number
  kind: 'actor' | 'event'
  depth: 0 | 1 | 2
}

export type HeroFieldProps = {
  className?: string
}
