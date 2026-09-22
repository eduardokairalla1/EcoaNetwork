/**
 * Types for the Badge.
 */

// --- IMPORTS ---
import type { ReactNode } from 'react'

// --- GLOBALS ---
export type BadgeTone =
  'neutral' | 'valid' | 'warning' | 'danger' | 'info' | 'signal'

export type BadgeProps = {
  tone?: BadgeTone
  glyph?: '■' | '●' | '◆'
  children: ReactNode
  className?: string
}
