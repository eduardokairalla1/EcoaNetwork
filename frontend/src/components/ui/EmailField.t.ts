/**
 * Types for the EmailField.
 */

// --- IMPORTS ---
import type { FieldProps } from '@/components/ui/Field.t'

// --- GLOBALS ---
export type EmailFieldProps = {
  value: string
  /** Called for typing and for picking a suggestion alike. */
  onValueChange: (value: string) => void
} & Omit<FieldProps, 'value' | 'onChange' | 'children' | 'type'>
