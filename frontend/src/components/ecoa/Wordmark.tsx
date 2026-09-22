/**
 * The Ecoa wordmark: four squares and the name.
 */

// --- IMPORTS ---
import type { WordmarkProps } from '@/components/ecoa/Wordmark.t'
import { cn } from '@/components/ui/cn'

// --- GLOBALS ---
const SQUARES = ['bg-signal', 'bg-primary', 'bg-primary', 'bg-signal']

// --- CODE ---
/**
 * Renders the mark and the name, for the caller to wrap in a link.
 *
 * @param props - Extra classes for the four squares.
 * @returns The mark and the name.
 */
export function Wordmark({ squareClassName }: WordmarkProps) {
  return (
    <>
      <span aria-hidden="true" className="grid grid-cols-2 gap-0.5">
        {SQUARES.map((tone, index) => (
          <span key={index} className={cn('size-2', squareClassName, tone)} />
        ))}
      </span>
      <span className="font-display text-h4 font-semibold tracking-wordmark">
        ECOA
      </span>
    </>
  )
}
