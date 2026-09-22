/**
 * Types for the Container.
 */

// --- IMPORTS ---
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

// --- GLOBALS ---
export type ContainerProps<T extends ElementType> = {
  as?: T
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>
