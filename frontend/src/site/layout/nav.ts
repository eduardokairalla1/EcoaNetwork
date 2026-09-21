/**
 * What the site's chrome links to.
 */

// --- IMPORTS ---
import { ROUTES } from '@/routes'

// --- GLOBALS ---
/** What the marketing site's chrome links to. */
/** In document order, and complete. */
export const NAV_LINKS = [
  { label: 'Why Ecoa', href: '#why-ecoa' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'A real review', href: '#a-real-review' },
  { label: 'Trust', href: '#trust' },
  { label: 'History', href: '#history' },
  { label: 'Network', href: '#network' },
  { label: 'Human first', href: '#human-first' },
  { label: 'FAQ', href: '#faq' },
] as const

export const FOOTER_LINKS = [
  {
    heading: 'Protocol',
    links: [
      { label: 'Specification', href: '#' },
      { label: 'Event types', href: '#' },
      { label: 'Documentation', href: '#' },
      { label: 'GitHub', href: '#' },
    ],
  },
  {
    heading: 'Network',
    links: [
      { label: 'Explore', href: ROUTES.explore },
      { label: 'Run a node', href: '#' },
      { label: 'Status', href: '#' },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'About Ecoa', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
] as const
