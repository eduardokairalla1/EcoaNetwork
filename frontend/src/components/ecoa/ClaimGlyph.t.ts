/**
 * Types for the ClaimGlyph.
 */

// --- GLOBALS ---
export type ClaimGlyphKind = 'domain' | 'human' | 'delegate' | 'purchase'

export type ClaimGlyphProps = {
  kind: ClaimGlyphKind
}
