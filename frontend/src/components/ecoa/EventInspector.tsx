/**
 * The Protocol Layer on demand: the signed event behind a review.
 */

// --- IMPORTS ---
import { cn } from '@/components/ui/cn'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

import type { EventInspectorProps } from '@/components/ecoa/EventInspector.t'
import { Badge } from '@/components/ui/Badge'

// --- GLOBALS ---
/** The Event Inspector — the Protocol Layer, on demand. */
const RAW_EVENT = `{
  "id": "8f2c9e14a41b7d3f",
  "kind": "review.created",
  "pubkey": "did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPd",
  "created_at": 1786790, 
  "entity": "ent:marés-bakery.pt",
  "content": { "rating": 4, "body": "…" },
  "sig": "3045022100c7f1…a9e2"
}`

// --- CODE ---
/**
 * Renders one labelled line of the envelope.
 *
 * @param props - The row label and its value.
 * @returns The row.
 */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'grid grid-cols-[9rem_1fr] gap-4 border-b border-line px-6 py-4',
      )}
    >
      <dt className="meta text-muted">{label}</dt>
      <dd className="font-mono text-mono-s break-all text-primary">
        {children}
      </dd>
    </div>
  )
}

/**
 * Renders the drawer holding a review's signed event.
 *
 * @param props - Whether the drawer is open, and the handler that
 * changes it.
 * @returns The drawer.
 */
export function EventInspector({ open, onOpenChange }: EventInspectorProps) {
  const reduceMotion = useReducedMotion()

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-100 bg-scrim"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          />
        </Dialog.Overlay>

        <Dialog.Content asChild>
          <motion.aside
            data-surface="dark"
            className={cn(
              'fixed inset-y-0 right-0 z-100 flex w-[min(40rem,100%)] flex-col',
              'overflow-y-auto border-l border-structural bg-canvas',
            )}
            initial={reduceMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }
            }
          >
            <header
              className={cn(
                'flex items-start justify-between gap-4 border-b',
                'border-structural px-6 py-5',
              )}
            >
              <div className="flex flex-col gap-2">
                <Dialog.Title
                  className={cn(
                    'font-display text-h3 font-semibold tracking-heading',
                  )}
                >
                  Signed event
                </Dialog.Title>
                <Dialog.Description className="text-body-s text-secondary">
                  Everything a stranger needs to check this review, without
                  asking Ecoa for permission.
                </Dialog.Description>
              </div>
              <Dialog.Close
                aria-label="Close event inspector"
                className={cn(
                  'meta cursor-pointer border border-structural px-3 py-2',
                  'text-secondary transition-colors duration-interface',
                  'hover:text-primary',
                )}
              >
                Close
              </Dialog.Close>
            </header>

            <dl className="flex flex-col">
              <Row label="Event ID">8f2c9e14a41b7d3f</Row>
              <Row label="Kind">review.created</Row>
              <Row label="Author">
                did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPd
              </Row>
              <Row label="Entity">ent:marés-bakery.pt</Row>
              <Row label="Version">2 of 2 · replaces 4d10…8c22</Row>
              <Row label="Signature">3045022100c7f1…a9e2</Row>
            </dl>

            <div
              className={cn(
                'flex flex-wrap items-center gap-2 border-b border-line px-6',
                'py-5',
              )}
            >
              {/* Never colour alone: each state has a glyph and a label. */}
              <Badge tone="valid" glyph="◆">
                Signature valid
              </Badge>
              <Badge tone="valid" glyph="◆">
                Domain verified
              </Badge>
              <Badge tone="neutral" glyph="●">
                Observed by 06 nodes
              </Badge>
            </div>

            <div className="flex flex-col gap-3 px-6 py-5">
              <p className="meta text-muted">Raw envelope</p>
              <pre
                className={cn(
                  'overflow-x-auto border border-line bg-surface-sunken p-4',
                  'font-mono text-mono-s text-secondary',
                )}
              >
                {RAW_EVENT}
              </pre>
            </div>
          </motion.aside>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
