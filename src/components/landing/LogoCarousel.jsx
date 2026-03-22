import { cn } from '../../lib/utils'
import { InfiniteSlider } from '../ui/infinite-slider'

const logos = [
  { src: 'https://svgl.app/library/hubspot.svg', alt: 'HubSpot' },
  { src: 'https://svgl.app/library/salesforce.svg', alt: 'Salesforce' },
  { src: 'https://svgl.app/library/quickbooks.svg', alt: 'QuickBooks' },
  { src: 'https://svgl.app/library/stripe.svg', alt: 'Stripe' },
  { src: 'https://svgl.app/library/notion.svg', alt: 'Notion' },
  { src: 'https://svgl.app/library/slack.svg', alt: 'Slack' },
  { src: 'https://svgl.app/library/google_sheets.svg', alt: 'Google Sheets' },
  { src: 'https://svgl.app/library/microsoft_excel.svg', alt: 'Excel' },
]

function LogoCloud({ className, logos }) {
  return (
    <div
      className={cn(
        'overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]',
        className
      )}
    >
      <InfiniteSlider gap={56} speed={60} speedOnHover={20}>
        {logos.map((logo) => (
          <img
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            loading="lazy"
            className="h-5 w-auto select-none opacity-40 grayscale transition-opacity duration-300 hover:opacity-70 md:h-6"
          />
        ))}
      </InfiniteSlider>
    </div>
  )
}

export const LogoCarousel = () => {
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="section-shell">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 text-center text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
            Se integra con las herramientas que ya usas
          </p>
          <LogoCloud logos={logos} />
        </div>
      </div>
    </section>
  )
}
