/**
 * An email control that completes the domain as you type.
 */

// --- IMPORTS ---
import { useId, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import type { EmailFieldProps } from '@/components/ui/EmailField.t'
import { Field } from '@/components/ui/Field'
import { cn } from '@/components/ui/cn'

// --- GLOBALS ---
const DOMAINS = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'yahoo.com',
  'proton.me',
] as const

const MAX_SUGGESTIONS = 4

// --- CODE ---
/**
 * Lists the domains worth offering for what has been typed so far.
 *
 * @param value - The whole address, as typed.
 * @returns Full addresses to offer, empty when there is nothing to add.
 */
function suggest(value: string) {
  const [local, domain, ...rest] = value.split('@')
  if (!local || domain === undefined || rest.length > 0) return []

  return DOMAINS.filter((d) => d.startsWith(domain) && d !== domain)
    .slice(0, MAX_SUGGESTIONS)
    .map((d) => `${local}@${d}`)
}

/**
 * Renders an email field with a keyboard-navigable domain list.
 *
 * @param props - The value, its setter, and the field's own props.
 * @returns The field and its suggestions.
 */
export function EmailField({
  value,
  onValueChange,
  ...props
}: EmailFieldProps) {
  const listId = useId()
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(-1)
  const [dismissed, setDismissed] = useState(false)

  const options = dismissed ? [] : suggest(value)
  const open = options.length > 0

  /**
   * Accepts a suggestion and closes the list.
   *
   * @param option - The full address chosen.
   * @returns Nothing.
   */
  const pick = (option: string) => {
    onValueChange(option)
    setDismissed(true)
    setActive(-1)
  }

  /**
   * Moves through the list, accepts, or dismisses it.
   *
   * @param event - The key pressed in the control.
   * @returns Nothing.
   */
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive((i) => (i + step + options.length) % options.length)
      return
    }

    // NOTE: Enter must be swallowed only while a suggestion is highlighted,
    // otherwise the list would block submitting the form.
    if (event.key === 'Enter' && active >= 0) {
      event.preventDefault()
      pick(options[active])
      return
    }

    if (event.key === 'Escape') setDismissed(true)
  }

  return (
    <Field
      {...props}
      type="email"
      value={value}
      onChange={(event) => {
        onValueChange(event.target.value)
        setDismissed(false)
        setActive(-1)
      }}
      onKeyDown={onKeyDown}
      onBlur={() => setDismissed(true)}
      role="combobox"
      aria-expanded={open}
      aria-controls={listId}
      aria-autocomplete="list"
      aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
      className={cn('relative', props.className)}
    >
      <AnimatePresence>
        {open ? (
          <motion.ul
            id={listId}
            role="listbox"
            initial={reduceMotion ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
            className={cn(
              'absolute top-full right-0 left-0 z-10 mt-1',
              'border border-structural bg-surface',
            )}
          >
            {options.map((option, index) => (
              <li key={option}>
                <button
                  type="button"
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === active}
                  // Fires before blur, so the click is not lost.
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => pick(option)}
                  onMouseEnter={() => setActive(index)}
                  className={cn(
                    'block w-full cursor-pointer px-4 py-2 text-left',
                    'font-mono text-mono-m transition-colors',
                    'duration-interface',
                    index === active
                      ? 'bg-signal-wash text-primary'
                      : 'text-secondary',
                  )}
                >
                  {option}
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </Field>
  )
}
