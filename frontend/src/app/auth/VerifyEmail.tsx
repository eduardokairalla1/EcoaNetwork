/**
 * Waiting on the link that finishes an account.
 */

// --- IMPORTS ---
import { useState } from 'react'
import { Link, useLocation } from 'react-router'

import { AuthShell } from '@/app/auth/AuthShell'
import type { VerifyState } from '@/app/auth/VerifyEmail.t'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/routes'

// --- GLOBALS ---
const FALLBACK_LEDE =
  'Open the link we sent you to finish creating your account. It expires in ' +
  'an hour.'

// --- CODE ---
/**
 * Builds the screen shown after an account is requested.
 *
 * @returns The verification screen.
 */
export function VerifyEmail() {
  const location = useLocation()
  const [resent, setResent] = useState(false)
  const email = (location.state as VerifyState | null)?.email

  return (
    <AuthShell
      eyebrow="Verify email"
      title="Check your inbox."
      lede={
        email
          ? `Open the link we sent to ${email} to finish creating your ` +
            'account. It expires in an hour.'
          : FALLBACK_LEDE
      }
      footer={
        <>
          Wrong address?{' '}
          <Link to={ROUTES.register} className="text-primary underline">
            Start again
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          disabled={resent}
          onClick={() => setResent(true)}
        >
          {resent ? 'Link sent' : 'Send it again'}
        </Button>

        <p className="text-body-s text-muted text-pretty">
          Nothing arrived? Check spam before asking for another. A second link
          invalidates the first.
        </p>
      </div>
    </AuthShell>
  )
}
