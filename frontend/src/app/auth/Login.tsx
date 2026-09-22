/**
 * Signing in to the platform.
 */

// --- IMPORTS ---
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'

import { AuthShell } from '@/app/auth/AuthShell'
import type { LoginErrors } from '@/app/auth/Login.t'
import { Button } from '@/components/ui/Button'
import { EmailField } from '@/components/ui/EmailField'
import { Field } from '@/components/ui/Field'
import { cn } from '@/components/ui/cn'
import { ROUTES } from '@/routes'

// --- GLOBALS ---
const LEDE = 'Sign in to write, reply and manage what is yours.'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// --- CODE ---
/**
 * Builds the screen that signs in to the platform.
 *
 * @returns The login screen.
 */
export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})

  /**
   * Validates both fields and holds the submission.
   *
   * @param event - The form submission.
   * @returns Nothing.
   */
  const submit = (event: FormEvent) => {
    event.preventDefault()

    const next: LoginErrors = {}
    if (!EMAIL.test(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Enter your password.'

    setErrors(next)
  }

  return (
    <AuthShell
      eyebrow="Sign in"
      title="Welcome back."
      lede={LEDE}
      footer={
        <>
          No account yet?{' '}
          <Link to={ROUTES.register} className="text-primary underline">
            Create one
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
          error={errors.email}
        />

        <Field
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          error={errors.password}
        />

        <Link
          to={ROUTES.forgotPassword}
          className={cn(
            'meta self-start text-muted transition-colors',
            'duration-interface hover:text-primary',
          )}
        >
          Forgot your password?
        </Link>

        <Button type="submit" size="lg">
          Sign in
        </Button>
      </form>
    </AuthShell>
  )
}
