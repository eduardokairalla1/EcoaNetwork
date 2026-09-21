/**
 * Scroll-in reveal props, ready to spread onto a motion element.
 */

// --- IMPORTS ---
import { useReducedMotion } from 'motion/react'

// --- CODE ---
/**
 * Builds scroll-in reveal props.
 *
 * @returns A function taking a delay and returning motion props.
 */
export function useReveal() {
  const reduceMotion = useReducedMotion()

  return (delay = 0) =>
    ({
      initial: reduceMotion ? false : { opacity: 0, y: 16 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.3 },
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] as const },
    }) as const
}
