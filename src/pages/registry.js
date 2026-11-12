import { PoweredByPage } from './powered-by/PoweredByPage'
import { HomePage } from './home/HomePage'
import { DemoPage } from './demo/DemoPage'
import { PricingPage } from './pricing/PricingPage'
import { LandingAdsPage } from './landing-ads/LandingAdsPage'
import { LandingPage } from '../landing/LandingPage'
import { PlaceholderPage } from './PlaceholderPage'
import { PAGE_DEFINITIONS } from './manifest'

// Component lookup belongs to rendering, never to route availability.
const COMPONENTS = {
  home: HomePage,
  demo: DemoPage,
  pricing: PricingPage,
  landing: LandingPage,
  landingAds: LandingAdsPage,
  poweredBy: PoweredByPage,
  placeholder: PlaceholderPage,
}

export const PAGE_COMPONENTS = Object.fromEntries(
  Object.entries(PAGE_DEFINITIONS).map(([id, page]) => [id, COMPONENTS[page.kind]]),
)
