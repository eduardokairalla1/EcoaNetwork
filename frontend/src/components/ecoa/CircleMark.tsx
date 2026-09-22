/**
 * The drawn hand mark: a loop around a word, or an underline beneath a phrase.
 */

// --- IMPORTS ---
import { motion, useReducedMotion } from 'motion/react'

import type {
  CircleMarkProps,
  CircleMarkVariant,
} from '@/components/ecoa/CircleMark.t'

// --- GLOBALS ---
const MARKS: Record<
  CircleMarkVariant,
  { viewBox: string; d: string; duration: number }
> = {
  /** Circles a single word. */
  loop: {
    viewBox: '0 0 220 96',
    d:
      'M196 30C170 9 120 4 74 9 35 13 9 27 7 45c-2 19 30 36 82 40 47 4 100-3 ' +
      '120-19 14-11 9-24-11-34C176 20 140 13 99 15',
    duration: 0.9,
  },
  /** Strikes under a phrase, so the same hand reads without repeating. */
  underline: {
    viewBox: '0 0 240 20',
    d: 'M2 12c40-7 82 6 124-1s70 5 112-3',
    duration: 0.7,
  },
}

// --- CODE ---
/**
 * Draws the hand mark over a word or phrase.
 *
 * @param props - Which mark, when it draws, its delay and extra classes.
 * @returns The mark, as inline SVG.
 */
export function CircleMark({
  variant = 'loop',
  className,
  delay = 0,
  on = 'inView',
  weight,
}: CircleMarkProps) {
  const reduceMotion = useReducedMotion()
  const mark = MARKS[variant]
  const drawn = { pathLength: 1 }

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={mark.viewBox}
      // Stretching the box is what lets one path fit words of different widths.
      preserveAspectRatio="none"
      className={className}
    >
      <motion.path
        d={mark.d}
        fill="none"
        stroke="var(--ecoa-hand)"
        strokeWidth={weight ?? 'var(--hand-weight)'}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="var(--hand-opacity)"
        // preserveAspectRatio squashes the stroke, so pin it to screen pixels.
        vectorEffect="non-scaling-stroke"
        initial={reduceMotion ? false : { pathLength: 0 }}
        {...(on === 'mount'
          ? { animate: drawn }
          : {
              whileInView: drawn,
              viewport: { once: true, amount: 0.6 } as const,
            })}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: mark.duration, delay, ease: [0.2, 0.8, 0.2, 1] }
        }
      />
    </svg>
  )
}
