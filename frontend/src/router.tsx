/**
 * The route tree. Only the site is wired so far.
 */

// --- IMPORTS ---
import { createBrowserRouter } from 'react-router'
import { Landing } from '@/site/landing/Landing'
import { NotFound } from '@/site/NotFound'
import { SiteLayout } from '@/site/layout/SiteLayout'

// --- GLOBALS ---
export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [{ index: true, element: <Landing /> }],
  },
  {
    element: <SiteLayout nav={false} />,
    children: [{ path: '*', element: <NotFound /> }],
  },
])
