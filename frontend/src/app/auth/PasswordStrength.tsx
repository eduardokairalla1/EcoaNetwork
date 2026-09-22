/**
 * How good a password is, and the shortest one we accept.
 */

// --- IMPORTS ---
import type { PasswordStrengthProps } from '@/app/auth/PasswordStrength.t'
import { cn } from '@/components/ui/cn'

// --- GLOBALS ---
export const MIN_PASSWORD = 8

const LABELS = ['Too short', 'Weak', 'Fair', 'Strong'] as const

// Semantic colour writes, never fills, so the bar stays neutral and the word
// next to it carries the meaning.
const TONES = [
  'text-muted',
  'text-danger',
  'text-warning',
  'text-valid',
] as const

// --- CODE ---
/**
 * Scores a password from 0 to 3, by length and by variety.
 *
 * @param password - What the person has typed so far.
 * @returns The score, indexing the labels and tones above.
 */
function scoreOf(password: string) {
  if (password.length < MIN_PASSWORD) return 0

  let score = 1
  if (/[^a-zA-Z]/.test(password)) score += 1
  if (password.length >= 12) score += 1

  return score
}

/**
 * Draws the strength bar and names the level beside it.
 *
 * @param props - The password being judged.
 * @returns The meter, or nothing while the field is empty.
 */
export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null

  const score = scoreOf(password)

  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="flex flex-1 gap-1">
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={cn(
              'h-1 flex-1 transition-colors duration-interface ease-standard',
              step <= score ? 'bg-primary' : 'bg-quiet',
            )}
          />
        ))}
      </span>

      <span className={cn('meta', TONES[score])}>{LABELS[score]}</span>
    </div>
  )
}
