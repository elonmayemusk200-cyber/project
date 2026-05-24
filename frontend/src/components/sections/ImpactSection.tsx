import { Award, Globe2, PackageCheck, ShieldCheck } from 'lucide-react'

const stats = [
  { value: '101,273+', label: 'Delivered Packages' },
  { value: '673,754+', label: 'KM Per Year' },
  { value: '16,714+', label: 'Happy Clients' },
  { value: '160+', label: 'Countries Served' },
]

const highlights = [
  { icon: PackageCheck, title: 'Delivery Performance', value: '99.8%', desc: 'On-Time Delivery' },
  { icon: Globe2, title: 'Tracking Precision', value: 'Real-time', desc: 'GPS Accuracy' },
  { icon: ShieldCheck, title: 'Client Satisfaction', value: '4.9/5', desc: 'Average Rating' },
]

const badges = [
  { icon: Award, label: '11+ Years Industry Experience' },
  { icon: ShieldCheck, label: 'ISO 27001 Security Certification' },
  { icon: Award, label: '8+ Awards Industry Recognition' },
]

export default function ImpactSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl">
          <p className="section-subtitle">Our Impact & Achievements</p>
          <h2 className="mt-3 section-title text-navy-500">Delivering excellence across the globe with industry-leading standards.</h2>
          <p className="mt-4 text-base leading-7 text-gray-600">
            We combine dependable execution, modern tracking, and a global network so every shipment is handled with speed, visibility, and trust.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-[1.5rem] border border-gray-100 bg-gray-50 px-5 py-6 text-center">
              <div className="font-display text-3xl font-bold text-brand-500">{item.value}</div>
              <div className="mt-2 text-[0.7rem] uppercase tracking-[0.25em] text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr,1fr]">
          {highlights.map(({ icon: Icon, title, value, desc }) => (
            <div key={title} className="rounded-[1.5rem] border border-gray-100 bg-gradient-to-br from-white to-amber-50 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">{title}</p>
                  <p className="mt-2 font-display text-2xl font-bold text-navy-900">{value}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {badges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-[1.25rem] border border-gray-100 bg-white p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold text-gray-700">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}