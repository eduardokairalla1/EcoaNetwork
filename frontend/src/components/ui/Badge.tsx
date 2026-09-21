/**
 * Status badge. Always a glyph and a label, never colour alone.
 */

// --- IMPORTS ---
import type { BadgeProps, BadgeTone } from '@/components/ui/Badge.t'
import { cn } from '@/components/ui/cn'

// --- GLOBALS ---
/** A state carries a glyph and a label, never colour alone. */
const TONES: Record<BadgeTone, string> = {
  neutral: 'text-secondary',
  valid: 'text-valid',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
  signal: 'border-signal bg-signal text-on-signal',
}

// --- CODE ---
/**
 * Renders a state as a glyph plus a label.
 *
 * @param props - Tone, optional glyph, label and extra classes.
 * @returns The badge.
 */
export function Badge({
  tone = 'neutral',
  glyph,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex min-h-7 items-center gap-2 border border-current px-2',
        'py-1',
        'font-mono text-mono-s font-semibold tracking-metadata uppercase',
        TONES[tone],
        className,
      )}
    >
      {glyph ? <span aria-hidden="true">{glyph}</span> : null}
      {children}
    </span>
  )
}
