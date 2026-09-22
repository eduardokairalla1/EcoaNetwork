/**
 * The site's footer.
 */

// --- IMPORTS ---
import { cn } from '@/components/ui/cn'
import { Container } from '@/components/ui/Container'
import { HeroField } from '@/site/landing/motifs/HeroField'
import { FOOTER_LINKS } from '@/site/layout/nav'

// --- CODE ---
/**
 * Renders the site footer.
 *
 * @returns The footer.
 */
export function SiteFooter() {
  return (
    <footer
      className={cn(
        'relative isolate overflow-hidden border-t border-structural bg-canvas',
        'py-16',
      )}
    >
      {/* The hero's field, at a whisper. */}
      <HeroField className="opacity-30" />

      <Container className="relative z-10 flex flex-col gap-12">
        <div
          className={cn(
            'grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:gap-20',
          )}
        >
          <div className="flex flex-col gap-4">
            <a
              href="#top"
              className="flex items-center gap-3"
              aria-label="Ecoa — home"
            >
              <span aria-hidden="true" className="grid grid-cols-2 gap-0.5">
                <span className="size-2 bg-signal" />
                <span className="size-2 bg-primary" />
                <span className="size-2 bg-primary" />
                <span className="size-2 bg-signal" />
              </span>
              <span
                className={cn(
                  'font-display text-h4 font-semibold tracking-wordmark',
                )}
              >
                ECOA
              </span>
            </a>
            <p
              className={cn(
                'font-display text-h3 font-medium tracking-heading',
                'text-secondary text-balance',
              )}
            >
              Every experience leaves an echo.
            </p>
          </div>

          <nav
            className="grid grid-cols-2 gap-10 sm:grid-cols-3"
            aria-label="Footer"
          >
            {FOOTER_LINKS.map((group) => (
              <div key={group.heading} className="flex flex-col gap-3">
                <h2 className="meta text-muted">{group.heading}</h2>
                <ul className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className={cn(
                          'text-body-s text-secondary transition-colors',
                          'duration-interface hover:text-primary',
                        )}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className="meta border-t border-line pt-6 text-muted">
          Ecoa / Open network / 2026
        </p>
      </Container>
    </footer>
  )
}
