'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Clock3, Package, Search, ShieldCheck, Truck, Plane, ShipWheel } from 'lucide-react'

const serviceSlides = [
  {
    title: 'Air Freight',
    description: 'Fast-moving international cargo with coordinated routing and full shipment visibility.',
    image: 'https://coexzggshiplogistics.live/temp/custom/images/services/service1.jpg',
    badge: 'Air Freight',
  },
  {
    title: 'Sea/Ocean Freight',
    description: 'Container-ready ocean freight solutions for import, export, and consolidated shipping plans.',
    image: 'https://coexzggshiplogistics.live/temp/custom/images/services/service2.jpg',
    badge: 'Ocean Freight',
  },
  {
    title: 'Road Transportation',
    description: 'Reliable domestic transport and last-mile delivery supported by live tracking and route planning.',
    image: 'https://coexzggshiplogistics.live/temp/custom/images/services/service3.jpg',
    badge: 'Road Transport',
  },
]

const servicePills = [
  { icon: Plane, label: 'Air Freight' },
  { icon: ShipWheel, label: 'Ocean Freight' },
  { icon: Truck, label: 'Road Transport' },
]

const reliabilityStats = [
  { value: '50K+', label: 'Deliveries Made' },
  { value: '48H', label: 'Avg Delivery Time' },
  { value: '99.2%', label: 'On-Time Rate' },
  { value: '15+', label: 'Years Experience' },
]

export default function HeroSection() {
  const [trackingId, setTrackingId] = useState('')
  const [activeSlide, setActiveSlide] = useState(0)
  const router = useRouter()

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingId.trim()) {
      router.push(`/track?id=${trackingId.trim().toUpperCase()}`)
    }
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % serviceSlides.length)
    }, 4800)

    return () => window.clearInterval(timer)
  }, [])

  const activeService = serviceSlides[activeSlide]

  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="hero-stripe absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.28),_transparent_30%),linear-gradient(135deg,#0b1120_0%,#13233f_48%,#0f172a_100%)]" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 via-amber-300 to-brand-600" />
      <div className="absolute -left-16 top-20 h-44 w-44 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/15 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand-100">
              <Package className="h-3.5 w-3.5" />
              Trusted Logistics Partner Since 2008
            </div>

            <h1 className="mt-6 font-display text-4xl leading-[0.95] text-white uppercase sm:text-5xl lg:text-6xl">
              Global freight solutions
              <span className="mt-3 block text-brand-300">built for speed and confidence.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg">
              A focused logistics partner for air freight, ocean freight, road delivery, and secure handling with full visibility and dependable coordination.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/about" className="btn-primary">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/contact" className="btn-outline border-white/80 text-white hover:bg-white hover:text-slate-950">
                Contact Us
              </a>
            </div>

            <div className="mt-10 rounded-[1.5rem] border border-white/10 bg-white/5 p-1 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.75)] backdrop-blur-sm">
              <form onSubmit={handleTrack} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter your tracking ID"
                  className="flex-1 rounded-[1rem] border border-transparent bg-white px-5 py-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-amber-300 px-6 py-4 font-display font-semibold uppercase tracking-[0.2em] text-slate-950 transition-all duration-200 hover:brightness-105"
                >
                  <Search className="h-4 w-4" />
                  Track
                </button>
              </form>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {servicePills.map(({ icon: Icon, label }) => (
                <div key={label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100">
                  <Icon className="h-4 w-4 text-brand-300" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-brand-500/45 via-amber-300/25 to-transparent blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950">
                <div className="relative aspect-[4/3]">
                  {serviceSlides.map((slide, index) => (
                    <div
                      key={slide.title}
                      className={`absolute inset-0 transition-all duration-1000 ${
                        index === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                      }`}
                    >
                      <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
                    </div>
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 rounded-[1rem] border border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-sm">
                    <p className="inline-flex items-center rounded-full border border-brand-300/40 bg-brand-500/15 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-brand-100">
                      {activeService.badge}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">{activeService.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/90">{activeService.description}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                {serviceSlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    aria-label={`Show ${slide.title} slide`}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeSlide ? 'w-8 bg-brand-400' : 'w-2.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: ShieldCheck, label: 'Secure' },
                  { icon: Clock3, label: '24/7 Support' },
                  { icon: Package, label: 'Live Tracking' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="rounded-[1.25rem] border border-white/10 bg-slate-900/80 px-4 py-4 text-center">
                    <Icon className="mx-auto h-5 w-5 text-brand-300" />
                    <p className="mt-2 text-[0.65rem] uppercase tracking-[0.2em] text-slate-200">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-gradient-to-r from-brand-500 to-amber-300">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-0 md:grid-cols-4">
            {reliabilityStats.map(({ value, label }) => (
              <div key={label} className="border-r border-white/20 px-6 py-5 text-center last:border-r-0">
                <div className="font-display text-2xl font-bold text-slate-950">{value}</div>
                <div className="mt-1 text-[0.7rem] uppercase tracking-[0.25em] text-slate-900/80">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}