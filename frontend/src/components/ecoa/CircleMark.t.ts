/**
 * Types for the CircleMark.
 */

// --- GLOBALS ---
export type CircleMarkVariant = 'loop' | 'underline'

export type CircleMarkProps = {
  variant?: CircleMarkVariant
  className?: string
  delay?: number
  /** The hero draws on arrival; the rest wait to be scrolled to. */
  on?: 'mount' | 'inView'
  /** Overrides --hand-weight, which is tuned for display type. */
  weight?: number
}
