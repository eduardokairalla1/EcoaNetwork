/**
 * Geometric button. Three variants, three sizes, never lifts on hover.
 */

// --- IMPORTS ---
import type { ElementType } from 'react'

import type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/Button.t'
import { cn } from '@/components/ui/cn'

// --- GLOBALS ---
/** Geometric: 40–44px tall, radius 0–2px, and never lifts. */
const VARIANTS: Record<ButtonVariant, string> = {
  // The label colour is a token: white on blue, paper on ink.
  primary: cn(
    'border-signal bg-signal text-on-signal',
    'hover:bg-signal-dim hover:border-signal-dim',
  ),
  secondary: cn(
    'border-structural bg-transparent text-primary',
    'hover:bg-primary hover:text-canvas',
  ),
  ghost: cn(
    'border-transparent bg-transparent text-secondary',
    'hover:border-structural hover:text-primary',
  ),
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-mono-s',
  md: 'min-h-11 px-5 text-label-m',
  lg: 'min-h-13 px-7 text-label-m',
}

// --- CODE ---
/**
 * Renders a geometric control as any element.
 *
 * @param props - Variant, size, the element to render as, and that
 * element’s own props.
 * @returns The rendered control.
 */
export function Button<T extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps<T>) {
  const Component = as ?? 'button'

  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center gap-2 border',
        'rounded-none font-mono font-semibold tracking-metadata uppercase',
        'cursor-pointer transition-colors duration-interface ease-standard',
        'disabled:pointer-events-none disabled:opacity-40',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
