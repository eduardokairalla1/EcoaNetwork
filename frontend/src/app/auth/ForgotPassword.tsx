/**
 * Asking for a link that lets you set a new password.
 */

// --- IMPORTS ---
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'

import { AuthShell } from '@/app/auth/AuthShell'
import { Button } from '@/components/ui/Button'
import { EmailField } from '@/components/ui/EmailField'
import { ROUTES } from '@/routes'

// --- GLOBALS ---
const ASK_LEDE =
  'Tell us the address on the account and we will send a link that lets you ' +
  'set a new password.'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// --- CODE ---
/**
 * Builds the screen that requests a password reset link.
 *
 * @returns The forgot-password screen.
 */
export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  /**
   * Validates the address and moves to the sent state.
   *
   * @param event - The form submission.
   * @returns Nothing.
   */
  const submit = (event: FormEvent) => {
    event.preventDefault()

    if (!EMAIL.test(email)) {
      setError('Enter a valid email address.')
      return
    }

    setError('')
    setSent(true)
  }

  if (sent) {
    return (
      <AuthShell
        eyebrow="Reset password"
        title="Check your inbox."
        lede={
          `If an account uses ${email}, a reset link is on its way. It ` +
          'expires in an hour.'
        }
        footer={
          <Link to={ROUTES.login} className="text-primary underline">
            Back to sign in
          </Link>
        }
      >
        {/* NOTE: the copy says "if an account uses" on purpose. Confirming
            that an address is registered would turn this form into a way to
            discover who has an account. */}
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => setSent(false)}
        >
          Use a different address
        </Button>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      eyebrow="Reset password"
      title="Forgot your password?"
      lede={ASK_LEDE}
      footer={
        <>
          Remembered it?{' '}
          <Link to={ROUTES.login} className="text-primary underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
        <EmailField
          label="Email"
          name="email"
          value={email}
          onValueChange={setEmail}
          autoComplete="email"
          placeholder="you@example.com"
          error={error}
        />

        <Button type="submit" size="lg">
          Send reset link
        </Button>
      </form>
    </AuthShell>
  )
}
