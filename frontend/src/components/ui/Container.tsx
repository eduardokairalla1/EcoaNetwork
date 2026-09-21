/**
 * The page grid: 1280px wide, with a gutter that never drops below 16px.
 */

// --- IMPORTS ---
import type { ElementType } from 'react'

import type { ContainerProps } from '@/components/ui/Container.t'
import { cn } from '@/components/ui/cn'

// --- CODE ---
/**
 * Centres content on the page grid.
 *
 * @param props - The element to render as, extra classes, and that
 * element’s own props.
 * @returns The centred wrapper.
 */
export function Container<T extends ElementType = 'div'>({
  as,
  className,
  children,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? 'div'

  return (
    <Component
      className={cn(
        'mx-auto w-[min(100%-2.5rem,var(--container-content))]',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
