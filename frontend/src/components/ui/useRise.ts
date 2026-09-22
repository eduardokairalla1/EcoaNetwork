/**
 * Rise-in motion props, for content already on screen at mount.
 */

// --- IMPORTS ---
import { useReducedMotion } from 'motion/react'

// --- CODE ---
/**
 * Builds rise-in motion props.
 *
 * @returns A function taking a delay and returning motion props.
 */
export function useRise() {
  const reduceMotion = useReducedMotion()

  return (delay = 0) =>
    ({
      initial: reduceMotion ? false : { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] as const },
    }) as const
}
