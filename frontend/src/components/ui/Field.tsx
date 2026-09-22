/**
 * A labelled text control, with room for a hint or an error.
 */

// --- IMPORTS ---
import { useId } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import type { FieldProps } from '@/components/ui/Field.t'
import { cn } from '@/components/ui/cn'

// --- CODE ---
/**
 * Renders a label, a control and the note under it.
 *
 * @param props - Label, optional hint or error, and the control's own props.
 * @returns The field.
 */
export function Field({
  label,
  hint,
  error,
  className,
  children,
  ...props
}: FieldProps) {
  const generated = useId()
  const reduceMotion = useReducedMotion()
  const id = props.id ?? generated
  const note = error ?? hint
  const noteId = note ? `${id}-note` : undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="meta text-secondary">
        {label}
      </label>

      <input
        {...props}
        id={id}
        aria-describedby={noteId}
        aria-invalid={error ? true : undefined}
        className={cn(
          'min-h-11 rounded-none border bg-surface px-4',
          'text-body-m text-primary placeholder:text-muted',
          'transition-colors duration-interface ease-standard',
          error ? 'border-danger' : 'border-structural focus:border-signal',
        )}
      />

      {children}

      {/* The note swaps between hint and error, so it animates instead of
          snapping the layout open under the control. */}
      <AnimatePresence initial={false} mode="wait">
        {note ? (
          <motion.p
            key={note}
            id={noteId}
            role={error ? 'alert' : undefined}
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            className={cn(
              'overflow-hidden text-body-s',
              error ? 'text-danger' : 'text-muted',
            )}
          >
            {note}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
