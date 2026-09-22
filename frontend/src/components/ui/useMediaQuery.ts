/**
 * Tracks a media query, seeded from the real viewport.
 */

// --- IMPORTS ---
import { useEffect, useState } from 'react'

// --- CODE ---
/**
 * Tracks whether a media query matches.
 *
 * @param query - The media query to track.
 * @returns Whether it matches right now.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const list = window.matchMedia(query)
    /**
     * Syncs the tracked value with its source.
     *
     * @returns Nothing.
     */
    const update = () => setMatches(list.matches)

    update()
    list.addEventListener('change', update)

    return () => list.removeEventListener('change', update)
  }, [query])

  return matches
}
