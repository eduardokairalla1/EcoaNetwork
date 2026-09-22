/**
 * Setting a new password, from the link in the email.
 */

// --- IMPORTS ---
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'

import { AuthShell } from '@/app/auth/AuthShell'
import { MIN_PASSWORD, PasswordStrength } from '@/app/auth/PasswordStrength'
import type { ResetPasswordErrors } from '@/app/auth/ResetPassword.t'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { ROUTES } from '@/routes'

// --- GLOBALS ---
const LEDE = 'Choose something you have not used here before.'

const EXPIRED_LEDE =
  'This link is missing or has already been used. Ask for a new one and it ' +
  'will arrive in a moment.'

const DONE_LEDE = 'Your password has been changed. You can sign in with it now.'

// --- CODE ---
/**
 * Builds the screen that sets a new password.
 *
 * @returns The reset screen, or the state that replaces it.
 */
export function ResetPassword() {
  const [params] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<ResetPasswordErrors>({})
  const [done, setDone] = useState(false)

  const token = params.get('token')

  /**
   * Validates both fields and moves to the done state.
   *
   * @param event - The form submission.
   * @returns Nothing.
   */
  const submit = (event: FormEvent) => {
    event.preventDefault()

    const next: ResetPasswordErrors = {}
    if (password.length < MIN_PASSWORD) {
      next.password = `At least ${MIN_PASSWORD} characters.`
    }
    if (confirm !== password) next.confirm = 'The two do not match.'

    setErrors(next)

    if (Object.keys(next).length === 0) setDone(true)
  }

  if (!token) {
    return (
      <AuthShell
        eyebrow="Reset password"
        title="This link no longer works."
        lede={EXPIRED_LEDE}
        footer={
          <Link to={ROUTES.login} className="text-primary underline">
            Back to sign in
          </Link>
        }
      >
        <Button as={Link} to={ROUTES.forgotPassword} size="lg">
          Ask for a new link
        </Button>
      </AuthShell>
    )
  }

  if (done) {
    return (
      <AuthShell
        eyebrow="Reset password"
        title="All set."
        lede={DONE_LEDE}
        footer="Any other device stays signed in until you sign it out."
      >
        <Button as={Link} to={ROUTES.login} size="lg">
          Sign in
        </Button>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      eyebrow="Reset password"
      title="Set a new password."
      lede={LEDE}
      footer={
        <Link to={ROUTES.login} className="text-primary underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
        <div className="flex flex-col gap-3">
          <Field
            label="New password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            error={errors.password}
            hint={password ? undefined : `At least ${MIN_PASSWORD} characters.`}
          />

          {errors.password ? null : <PasswordStrength password={password} />}
        </div>

        <Field
          label="Confirm password"
          name="confirm"
          type="password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          autoComplete="new-password"
          error={errors.confirm}
        />

        <Button type="submit" size="lg">
          Change password
        </Button>
      </form>
    </AuthShell>
  )
}
