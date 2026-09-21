/**
 * Class name merge, taught about this project's own scales.
 */

// --- IMPORTS ---
import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// --- GLOBALS ---
// NOTE: tailwind-merge files unknown `text-*` under colour, so a variant
// colour and a size class evict each other. Both failures are silent.
const FONT_SIZES = [
  'display-xl',
  'display-l',
  'display-m',
  'h1',
  'h2',
  'h3',
  'h4',
  'body-l',
  'body-m',
  'body-s',
  'label-m',
  'label-s',
  'mono-m',
  'mono-s',
] as const

// NOTE: custom utilities are invisible to tailwind-merge, so an override
// would keep both durations and let stylesheet order decide.
const DURATIONS = ['interface', 'surface'] as const

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...FONT_SIZES] }],
      duration: [{ duration: [...DURATIONS] }],
    },
  },
})

// --- CODE ---
/** Merge conditional class names, letting later Tailwind utilities win. */

/**
 * Merges class names, letting later utilities win.
 *
 * @param inputs - Class values, conditional or plain.
 * @returns One class string, with later Tailwind utilities winning.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
