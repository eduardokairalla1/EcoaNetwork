/**
 * Types for the Propagation motif.
 */

// --- GLOBALS ---
export type PropagationProps = {
  className?: string
  /** Bumping this replays the propagation — publishing an event re-runs it. */
  runKey?: number
}
