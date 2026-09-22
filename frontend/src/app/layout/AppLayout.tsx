/**
 * The platform's chrome, around each app page.
 */

// --- IMPORTS ---
import { Link, Outlet } from 'react-router'

import { Wordmark } from '@/components/ecoa/Wordmark'
import { Container } from '@/components/ui/Container'
import { ROUTES } from '@/routes'

// --- CODE ---
/**
 * Wraps every app page in the shared chrome.
 *
 * @returns The chrome, with the matched route rendered inside it.
 */
export function AppLayout() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-60 bg-canvas">
        <Container className="flex h-[var(--header-h)] items-center">
          <Link
            to={ROUTES.home}
            className="flex items-center gap-3"
            aria-label="Ecoa — home"
          >
            <Wordmark />
          </Link>
        </Container>
      </header>

      <main id="main">
        <Outlet />
      </main>
    </>
  )
}
