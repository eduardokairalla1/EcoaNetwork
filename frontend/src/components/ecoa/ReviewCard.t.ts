/**
 * Types for the ReviewCard, and the review it draws.
 */

// --- GLOBALS ---
export type Review = {
  entity: string
  entityKind: string
  rating: number
  title: string
  body: string
  author: string
  authorClaim?: { label: string; tone: 'valid' | 'info' | 'neutral' }
  publishedAt: string
  eventId: string
  observedBy: number
  edited?: boolean
}

export type ReviewCardProps = {
  review: Review
  onInspect?: () => void
  className?: string
}
