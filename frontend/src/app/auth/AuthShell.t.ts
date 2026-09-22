/**
 * Types for the AuthShell.
 */

// --- IMPORTS ---
import type { ReactNode } from 'react'

// --- GLOBALS ---
export type AuthShellProps = {
  eyebrow: string
  title: string
  lede: string
  children: ReactNode
  footer: ReactNode
}
