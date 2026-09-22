/**
 * Types for the ProblemGlyph.
 */

// --- GLOBALS ---
export type ProblemGlyphKind =
  'captive' | 'overwritten' | 'unverifiable' | 'central'

export type ProblemGlyphProps = {
  kind: ProblemGlyphKind
}
