import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ArrowRight, PackagePlus, Plane, ShieldCheck, ShipWheel, Truck, Warehouse } from 'lucide-react'

const services = [
  {
    icon: Plane,
    title: 'Air Freight',
    summary: 'Fast, dependable air cargo support for urgent shipments, high-value goods, and time-critical deliveries.',
    detail: 'Ideal for cross-border express moves, urgent spare parts, and premium cargo requiring rapid turnaround.',
    image: 'https://coexzggshiplogistics.live/temp/custom/images/services/service1.jpg',
  },
  {
    icon: ShipWheel,
    title: 'Sea/Ocean Freight',
    summary: 'Large-volume routing built for cost-conscious supply chains.',
    detail: 'From FCL planning to port-to-door coordination, we simplify complex cargo movement across global routes.',
    image: 'https://coexzggshiplogistics.live/temp/custom/images/services/service2.jpg',
  },
  {
    icon: Truck,
    title: 'Road Transportation',
    summary: 'Regional and last-mile delivery with dependable tracking.',
    detail: 'Built for time-sensitive distribution, route planning, and dependable delivery windows across every mile.',
    image: 'https://coexzggshiplogistics.live/temp/custom/images/services/service3.jpg',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Logistics',
    summary: 'Secure, controlled handling for sensitive documentation, diplomatic materials, and high-security cargo.',
    detail: 'Designed for strict custody, discreet routing, and end-to-end visibility when security is non-negotiable.',
    image: 'https://coexzggshiplogistics.live/temp/custom/images/services/service4.jpg',
  },
  {
    icon: Warehouse,
    title: 'Warehousing',
    summary: 'Purpose-built storage operations that support inventory buffering, consolidation, and short-term holding.',
    detail: 'Flexible storage capacity with organized receiving, dispatch, and inventory control built for pace.',
    image: 'https://coexzggshiplogistics.live/temp/custom/images/services/service5.jpg',
  },
  {
    icon: PackagePlus,
    title: 'Packaging & Storage',
    summary: 'Professional packaging, labeling, and storage support that protects goods from dispatch to delivery.',
    detail: 'From protective packaging to consolidated storage, we keep your cargo secure, organized, and ready for movement.',
    image: 'https://coexzggshiplogistics.live/temp/custom/images/services/service6.jpg',
  },
]

const benefits = [
  '24/7 shipment visibility and proactive communication',
  'Custom handling for fragile, high-value, and urgent freight',
  'Cross-border logistics support for smooth customs movement',
  'Dedicated coordination for urgent and secure cargo programs',
]

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="https://cdn.coverr.co/videos/coverr-container-ship-loading-1575296849525/1080p.mp4"
            autoPlay
            muted
            loop
            playsInline
            poster="/videos/images/warehouse.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-brand-700/70" />
          <div className="absolute -left-16 top-16 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute bottom-8 right-8 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-brand-100">
                OUR SERVICE
              </span>
              <h1 className="mt-5 section-title text-white">Logistics solutions built for every mile, mode, and mission.</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-100 sm:text-lg">
                From urgent air cargo to secure diplomatic handling, we deliver an end-to-end logistics experience with visible control, dependable coordination, and polished execution.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary">
                  Get a Quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#services" className="btn-outline border-white text-white hover:bg-white hover:text-navy-900">
                  Explore Services
                </a>
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Modes Covered', value: '6' },
                { label: 'Secure Handling', value: '24/7' },
                { label: 'Cross-Border Support', value: 'Global' },
                { label: 'Response Time', value: 'Same Day' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
                  <p className="text-sm uppercase tracking-[0.2em] text-brand-100">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-gradient-to-br from-amber-50 to-white p-6 sm:p-8">
            <div className="max-w-3xl">
              <p className="section-subtitle">Why teams choose us</p>
              <h2 className="mt-3 section-title text-navy-500">A polished logistics experience from planning to delivery.</h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Every shipment is managed with a unified approach — rapid coordination, clean communication, and real-time visibility. Whether you need a single leg or a fully integrated logistics program, we build the path around your cargo and timeline.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {benefits.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="section-subtitle">OUR SERVICE</p>
              <h2 className="mt-3 section-title text-navy-500">Built for air, sea, road, secure, and storage logistics.</h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Each service is designed to support your cargo with clear communication, secure handling, and tailored dispatch support.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map(({ icon: Icon, title, summary, detail, image }) => (
                <article key={title} className="overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-35px_rgba(15,23,42,0.45)]">
                  <img src={image} alt={title} className="h-40 w-full object-cover" loading="lazy" />
                  <div className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-navy-900">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{summary}</p>
                    <p className="mt-3 text-sm leading-6 text-gray-500">{detail}</p>
                    <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-500">
                      Discuss this service
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-gradient-to-r from-slate-950 to-navy-700 px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="section-subtitle text-brand-200">Need a tailored plan?</p>
                <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Let’s build the right logistics solution for your cargo.</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">Request a Quote</Link>
                <Link href="/track" className="btn-outline border-white text-white hover:bg-white hover:text-navy-900">Track a Shipment</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}