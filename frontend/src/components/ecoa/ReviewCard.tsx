/**
 * A review as a card — what a reader normally gets.
 */

// --- IMPORTS ---
import type { ReviewCardProps } from '@/components/ecoa/ReviewCard.t'
import { Badge } from '@/components/ui/Badge'
import { Rating } from '@/components/ecoa/Rating'
import { cn } from '@/components/ui/cn'

// --- CODE ---
/**
 * Renders a review as a card.
 *
 * @param props - The review, an optional inspect handler, and extra
 * classes.
 * @returns The card.
 */
export function ReviewCard({ review, onInspect, className }: ReviewCardProps) {
  return (
    <article
      className={cn(
        'flex flex-col border border-structural bg-surface',
        className,
      )}
    >
      <header
        className={cn(
          'flex flex-wrap items-start justify-between gap-3 border-b',
          'border-line',
          'px-6 py-4',
        )}
      >
        <div className="flex flex-col gap-1">
          <p className="meta text-muted">{review.entityKind}</p>
          <p className="font-display text-h4 font-semibold tracking-heading">
            {review.entity}
          </p>
        </div>
        <Rating value={review.rating} />
      </header>

      {/* Human content: no tracking, no mono, comfortable measure. */}
      <div className="flex flex-col gap-3 px-6 py-5">
        <h3 className="text-body-l font-semibold text-pretty">
          {review.title}
        </h3>
        <p className="reading-measure text-body-m text-secondary text-pretty">
          {review.body}
        </p>
      </div>

      <div
        className={cn(
          'flex flex-wrap items-center gap-2 border-t border-line px-6 py-3',
        )}
      >
        <span className="meta text-secondary">{review.author}</span>
        {review.authorClaim ? (
          <Badge tone={review.authorClaim.tone} glyph="◆">
            {review.authorClaim.label}
          </Badge>
        ) : null}
        {review.edited ? (
          // Foundation: an edit publishes a new version, it never overwrites.
          <Badge tone="neutral" glyph="■">
            Replaced · v2
          </Badge>
        ) : null}
      </div>

      <footer
        className={cn(
          'flex flex-wrap items-center justify-between gap-3 border-t',
          'border-structural px-6 py-3',
        )}
      >
        <p className="meta text-muted">
          Event / {review.eventId} · Observed by /{' '}
          {String(review.observedBy).padStart(2, '0')} nodes
        </p>
        {onInspect ? (
          <button
            type="button"
            onClick={onInspect}
            className={cn(
              // Ink label with a blue underline, not blue label.
              'meta cursor-pointer border-b-2 border-signal text-primary',
              'transition-colors duration-interface hover:border-signal-dim',
              'hover:text-secondary',
            )}
          >
            Inspect event ↗
          </button>
        ) : null}
      </footer>
    </article>
  )
}
