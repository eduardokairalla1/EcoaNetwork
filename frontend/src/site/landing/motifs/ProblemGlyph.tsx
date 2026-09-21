/**
 * One diagram per problem, drawn in the Ecoa vocabulary.
 */

// --- IMPORTS ---
import { motion, useReducedMotion } from 'motion/react'

import type { ProblemGlyphProps } from '@/site/landing/motifs/ProblemGlyph.t'

// --- GLOBALS ---
const EASE = [0.2, 0.8, 0.2, 1] as const

// --- CODE ---
/**
 * Draws the diagram for one problem.
 *
 * @param props - Which problem to draw.
 * @returns The glyph, as inline SVG.
 */
export function ProblemGlyph({ kind }: ProblemGlyphProps) {
  const reduceMotion = useReducedMotion()

  /**
   * Builds motion props that draw a stroke in.
   *
   * @param delay - Seconds before it starts.
   * @param duration - How long the stroke takes.
   * @returns Props to spread onto a motion path.
   */
  const draw = (delay: number, duration = 0.5) =>
    reduceMotion
      ? { initial: false, animate: {}, transition: { duration: 0 } }
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, amount: 0.6 },
          transition: { duration, delay, ease: EASE },
        }

  /**
   * Builds motion props that scale a shape in.
   *
   * @param delay - Seconds before it starts.
   * @returns Props to spread onto a motion element.
   */
  const pop = (delay: number) =>
    reduceMotion
      ? { initial: false, animate: {}, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, scale: 0.4 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: { once: true, amount: 0.6 },
          transition: { duration: 0.3, delay, ease: EASE },
          style: {
            transformBox: 'fill-box' as const,
            transformOrigin: 'center' as const,
          },
        }

  /**
   * Builds motion props that fade a shape to an opacity.
   *
   * @param delay - Seconds before it starts.
   * @param to - Opacity it settles at.
   * @returns Props to spread onto a motion element.
   */
  const fade = (delay: number, to: number) =>
    reduceMotion
      ? {
          initial: false,
          animate: { opacity: to },
          transition: { duration: 0 },
        }
      : {
          initial: { opacity: 0.85 },
          whileInView: { opacity: to },
          viewport: { once: true, amount: 0.6 },
          transition: { duration: 0.6, delay, ease: EASE },
        }

  const common = {
    viewBox: '0 0 72 72',
    'aria-hidden': true as const,
    focusable: 'false' as const,
    className: 'size-16 overflow-visible',
    fill: 'none',
    stroke: 'var(--ecoa-text-primary)',
    strokeWidth: 1.5,
    vectorEffect: 'non-scaling-stroke' as const,
  }

  if (kind === 'captive') {
    // The review sits inside a container whose walls the reader cannot open.
    return (
      <svg {...common}>
        <motion.path d="M14 10 H6 V62 H14" {...draw(0)} />
        <motion.path d="M58 10 H66 V62 H58" {...draw(0.08)} />
        <motion.rect
          x={26}
          y={28}
          width={20}
          height={20}
          fill="var(--ecoa-accent)"
          stroke="none"
          {...pop(0.24)}
        />
        <motion.path d="M26 18 H46" strokeDasharray="3 4" {...draw(0.34)} />
        <motion.path d="M26 58 H46" strokeDasharray="3 4" {...draw(0.4)} />
      </svg>
    )
  }

  if (kind === 'overwritten') {
    // v1 does not move aside, it disappears: the new version takes its place.
    return (
      <svg {...common}>
        <motion.rect
          x={12}
          y={14}
          width={22}
          height={22}
          strokeDasharray="3 4"
          {...fade(0.5, 0.25)}
        />
        <motion.path d="M34 25 H50" strokeDasharray="3 4" {...draw(0.2)} />
        <motion.rect
          x={38}
          y={36}
          width={22}
          height={22}
          fill="var(--ecoa-accent)"
          stroke="none"
          {...pop(0.42)}
        />
      </svg>
    )
  }

  if (kind === 'unverifiable') {
    // The artifact exists; the line back to its author does not resolve.
    return (
      <svg {...common}>
        <motion.rect
          x={8}
          y={26}
          width={20}
          height={20}
          fill="var(--ecoa-accent)"
          stroke="none"
          {...pop(0.1)}
        />
        <motion.path d="M28 36 H50" strokeDasharray="3 4" {...draw(0.24)} />
        <motion.circle
          cx={58}
          cy={36}
          r={9}
          strokeDasharray="3 4"
          {...draw(0.4)}
        />
      </svg>
    )
  }

  // One actor in the middle; every line runs inward and nothing runs across.
  return (
    <svg {...common}>
      <motion.path d="M36 12 V26" {...draw(0.1)} />
      <motion.path d="M36 46 V60" {...draw(0.16)} />
      <motion.path d="M12 36 H26" {...draw(0.22)} />
      <motion.path d="M46 36 H60" {...draw(0.28)} />
      <motion.circle cx={36} cy={8} r={4} {...pop(0.3)} />
      <motion.circle cx={36} cy={64} r={4} {...pop(0.34)} />
      <motion.circle cx={8} cy={36} r={4} {...pop(0.38)} />
      <motion.circle cx={64} cy={36} r={4} {...pop(0.42)} />
      <motion.circle
        cx={36}
        cy={36}
        r={10}
        fill="var(--ecoa-accent)"
        stroke="none"
        {...pop(0.12)}
      />
    </svg>
  )
}
