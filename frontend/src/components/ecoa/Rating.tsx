/**
 * A star rating, in ink. Information, not a verdict.
 */

// --- IMPORTS ---
import type { RatingProps } from '@/components/ecoa/Rating.t'
import { cn } from '@/components/ui/cn'

// --- CODE ---
/**
 * Renders a rating as stars plus a number.
 *
 * @param props - The rating, and extra classes.
 * @returns The stars and their numeric reading.
 */
export function Rating({ value, className }: RatingProps) {
  const rounded = Math.round(value)

  return (
    <p className={cn('flex items-center gap-2', className)}>
      <span aria-hidden="true" className="text-body-m tracking-[0.1em]">
        {'★'.repeat(rounded)}
        <span className="text-muted">{'☆'.repeat(5 - rounded)}</span>
      </span>
      <span className="meta text-secondary">{value.toFixed(1)} / 5</span>
    </p>
  )
}
