/**
 * One diagram per claim, showing what was actually checked.
 */

// --- IMPORTS ---
import { motion, useReducedMotion } from 'motion/react'

import type { ClaimGlyphProps } from '@/components/ecoa/ClaimGlyph.t'

// --- GLOBALS ---
const EASE = [0.2, 0.8, 0.2, 1] as const

// --- CODE ---
/**
 * Draws the diagram for one claim.
 *
 * @param props - Which claim to draw.
 * @returns The glyph, as inline SVG.
 */
export function ClaimGlyph({ kind }: ClaimGlyphProps) {
  const reduceMotion = useReducedMotion()

  /**
   * Builds motion props that draw a stroke in.
   *
   * @param delay - Seconds before it starts.
   * @returns Props to spread onto a motion path.
   */
  const draw = (delay: number) =>
    reduceMotion
      ? { initial: false as const }
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, amount: 0.6 },
          transition: { duration: 0.45, delay, ease: EASE },
        }

  /**
   * Builds motion props that scale a shape in.
   *
   * @param delay - Seconds before it starts.
   * @returns Props to spread onto a motion element.
   */
  const pop = (delay: number) =>
    reduceMotion
      ? { initial: false as const }
      : {
          initial: { opacity: 0, scale: 0.4 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: { once: true, amount: 0.6 },
          transition: { duration: 0.28, delay, ease: EASE },
          style: {
            transformBox: 'fill-box' as const,
            transformOrigin: 'center' as const,
          },
        }

  const svg = {
    viewBox: '0 0 96 48',
    'aria-hidden': true as const,
    focusable: 'false' as const,
    className: 'h-12 w-24 overflow-visible',
    fill: 'none',
    stroke: 'var(--ecoa-text-primary)',
    strokeWidth: 1.5,
    vectorEffect: 'non-scaling-stroke' as const,
  }

  if (kind === 'domain') {
    // Account and domain are the same party: solid both ways.
    return (
      <svg {...svg}>
        <motion.circle cx={14} cy={24} r={9} {...pop(0)} />
        <motion.path d="M23 24 H55" {...draw(0.14)} />
        <motion.rect
          x={57}
          y={12}
          width={24}
          height={24}
          fill="var(--ecoa-signal)"
          stroke="none"
          {...pop(0.26)}
        />
        <motion.path d="M69 6 V12" {...draw(0.34)} />
        <motion.path d="M69 36 V42" {...draw(0.34)} />
      </svg>
    )
  }

  if (kind === 'human') {
    // One actor staked its own reputation on another.
    return (
      <svg {...svg}>
        <motion.circle cx={16} cy={24} r={9} {...pop(0)} />
        <motion.path d="M25 24 H63" strokeDasharray="4 4" {...draw(0.16)} />
        <motion.circle
          cx={74}
          cy={24}
          r={11}
          fill="none"
          stroke="var(--ecoa-signal)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          {...pop(0.3)}
        />
      </svg>
    )
  }

  if (kind === 'delegate') {
    // The entity granted it and can revoke it, so the path stays open.
    return (
      <svg {...svg}>
        <motion.rect x={8} y={12} width={24} height={24} {...pop(0)} />
        <motion.path d="M32 20 H62" {...draw(0.16)} />
        <motion.path d="M62 28 H32" strokeDasharray="4 4" {...draw(0.28)} />
        <motion.circle
          cx={74}
          cy={24}
          r={11}
          fill="var(--ecoa-signal)"
          stroke="none"
          {...pop(0.36)}
        />
      </svg>
    )
  }

  // A third party signed that a transaction existed.
  return (
    <svg {...svg}>
      <motion.rect
        x={10}
        y={12}
        width={24}
        height={24}
        fill="var(--ecoa-signal)"
        stroke="none"
        {...pop(0)}
      />
      <motion.path d="M34 24 H56" {...draw(0.16)} />
      <motion.path
        d="M62 24 L70 32 L86 14"
        stroke="var(--ecoa-signal)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        {...draw(0.3)}
      />
    </svg>
  )
}
