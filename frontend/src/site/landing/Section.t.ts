/**
 * Types for the landing's Section and SectionHeading.
 */

// --- IMPORTS ---
import type { ReactNode } from 'react'

// --- GLOBALS ---
export type SectionProps = {
  id?: string
  surface?: 'light' | 'dark'
  grid?: boolean
  className?: string
  children: ReactNode
}

export type SectionHeadingProps = {
  eyebrow: string
  title: ReactNode
  lede?: string
  className?: string
}
