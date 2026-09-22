/**
 * The route tree for the site and the platform.
 */

// --- IMPORTS ---
import { createBrowserRouter } from 'react-router'

import { AppLayout } from '@/app/layout/AppLayout'
import { Login } from '@/app/auth/Login'
import { Register } from '@/app/auth/Register'
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
    path: 'app',
    element: <AppLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    element: <SiteLayout nav={false} />,
    children: [{ path: '*', element: <NotFound /> }],
  },
])
