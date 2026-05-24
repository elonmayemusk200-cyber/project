import Link from 'next/link'
import { ArrowRight, Plane, ShieldCheck, ShipWheel, Truck } from 'lucide-react'

const services = [
  {
    icon: Plane,
    title: 'Air Freight',
    summary: 'Rapid air cargo solutions for urgent shipments, premium goods, and time-sensitive programs.',
    image: 'https://coexzggshiplogistics.live/temp/custom/images/services/service1.jpg',
  },
  {
    icon: ShipWheel,
    title: 'Sea/Ocean Freight',
    summary: 'Large-volume routing built for cost-conscious supply chains and global import/export movement.',
    image: 'https://coexzggshiplogistics.live/temp/custom/images/services/service2.jpg',
  },
  {
    icon: Truck,
    title: 'Road Transportation',
    summary: 'Regional and last-mile delivery with dependable tracking, route visibility, and fast coordination.',
    image: 'https://coexzggshiplogistics.live/temp/custom/images/services/service3.jpg',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Logistics',
    summary: 'Secure handling for sensitive documentation, high-trust cargo, and controlled transfer workflows.',
    image: 'https://coexzggshiplogistics.live/temp/custom/images/services/service4.jpg',
  },
]

const featuredPoints = [
  'Clear visibility from dispatch to delivery',
  'Dedicated support for urgent and high-value cargo',
  'Flexible coordination across air, ocean, road, and secure logistics',
]

export default function ServicesSection() {
  return (
    <section id="services" className="bg-gradient-to-b from-amber-50 via-white to-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr,1.05fr] lg:items-start">
          <div>
            <p className="section-subtitle">OUR SERVICES</p>
            <h2 className="mt-3 section-title text-navy-500">Premium logistics coverage with a cleaner, sharper customer experience.</h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              From urgent air cargo to secure handling and dependable delivery, every service is positioned around clarity, performance, and transparent communication.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {services.map(({ icon: Icon, title, summary, image }) => (
                <div
                  key={title}
                  className="overflow-hidden rounded-[1.25rem] border border-orange-100 bg-white shadow-[0_22px_60px_-35px_rgba(249,115,22,0.45)]"
                >
                  <div className="relative">
                    <img src={image} alt={title} className="h-40 w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-navy-900">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{summary}</p>
                    <Link href="/services" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services" className="btn-primary">
                View Full Service Page
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Request a Quote
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-slate-950 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.55)]">
            <div className="relative">
              <img
                src="https://coexzggshiplogistics.live/temp/custom/images/services/service-right-1.jpg"
                alt="Global logistics operations"
                className="h-72 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
              <div className="absolute inset-x-5 bottom-5">
                <p className="inline-flex items-center rounded-full border border-brand-300/40 bg-brand-500/20 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-100">
                  Featured capability
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">Secure warehousing, smooth transport, and precise visibility.</h3>
              </div>
            </div>

            <div className="bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">What you can expect</p>
              <div className="mt-4 space-y-3">
                {featuredPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    <p className="text-sm leading-6 text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}