/**
 * Creating a platform account.
 */

// --- IMPORTS ---
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'

import { AuthShell } from '@/app/auth/AuthShell'
import { MIN_PASSWORD, PasswordStrength } from '@/app/auth/PasswordStrength'
import type { RegisterErrors } from '@/app/auth/Register.t'
import { Button } from '@/components/ui/Button'
import { EmailField } from '@/components/ui/EmailField'
import { Field } from '@/components/ui/Field'
import { ROUTES } from '@/routes'

// --- GLOBALS ---
const LEDE =
  'An account to sign in with. Reading Ecoa never needs one. This is for ' +
  'writing, replying and managing what is yours.'

// Lowercase, starts with a letter, 3–30 long. It is what appears on every
// review, so it is claimed here rather than later.
const HANDLE = /^[a-z][a-z0-9._-]{2,29}$/

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// --- CODE ---
/**
 * Builds the screen that creates a platform account.
 *
 * @returns The register screen.
 */
export function Register() {
  const navigate = useNavigate()
  const [handle, setHandle] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<RegisterErrors>({})

  /**
   * Validates the three fields and holds the submission.
   *
   * @param event - The form submission.
   * @returns Nothing.
   */
  const submit = (event: FormEvent) => {
    event.preventDefault()

    const next: RegisterErrors = {}
    if (!HANDLE.test(handle)) {
      next.handle = 'Lowercase, starting with a letter, 3 characters or more.'
    }
    if (!EMAIL.test(email)) next.email = 'Enter a valid email address.'
    if (password.length < MIN_PASSWORD) {
      next.password = `At least ${MIN_PASSWORD} characters.`
    }
    if (confirm !== password) next.confirm = 'The two do not match.'

    setErrors(next)

    if (Object.keys(next).length === 0) {
      navigate(ROUTES.verify, { state: { email } })
    }
  }

  return (
    <AuthShell
      eyebrow="Create account"
      title="Create your account."
      lede={LEDE}
      footer={
        <>
          Already have an account?{' '}
          <Link to={ROUTES.login} className="text-primary underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
        <Field
          label="Handle"
          name="handle"
          value={handle}
          onChange={(event) => setHandle(event.target.value)}
          autoComplete="username"
          placeholder="joana.k"
          error={errors.handle}
          hint="What appears on everything you publish."
        />

        <EmailField
          label="Email"
          name="email"
          value={email}
          onValueChange={setEmail}
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email}
        />

        <div className="flex flex-col gap-3">
          <Field
            label="Password"
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
          Create account
        </Button>
      </form>
    </AuthShell>
  )
}
