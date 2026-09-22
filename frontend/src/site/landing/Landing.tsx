/**
 * The landing page: its sections, in order.
 */

// --- IMPORTS ---
import { Faq } from '@/site/landing/sections/Faq'
import { FinalCta } from '@/site/landing/sections/FinalCta'
import { Hero } from '@/site/landing/sections/Hero'
import { History } from '@/site/landing/sections/History'
import { HowItWorks } from '@/site/landing/sections/HowItWorks'
import { HumanFirst } from '@/site/landing/sections/HumanFirst'
import { Network } from '@/site/landing/sections/Network'
import { Problem } from '@/site/landing/sections/Problem'
import { RealReview } from '@/site/landing/sections/RealReview'
import { Trust } from '@/site/landing/sections/Trust'

// --- CODE ---
/**
 * Assembles the landing sections in order.
 *
 * @returns The landing sections, in document order.
 */
export function Landing() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <RealReview />
      <Trust />
      <History />
      <Network />
      <HumanFirst />
      <FinalCta />
      <Faq />
    </>
  )
}
