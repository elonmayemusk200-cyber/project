import { BadgeCheck, Clock3, Globe2, PackageCheck, ShieldCheck, Truck } from 'lucide-react'

const reasons = [
  { icon: PackageCheck, title: 'Track & Trace', desc: 'Fast and reliable way to check the real-time status of your shipment with our advanced tracking system.' },
  { icon: ShieldCheck, title: 'Secure Warehousing', desc: 'We leverage a network of operational warehousing facilities with state-of-the-art security systems.' },
  { icon: Truck, title: 'Express Delivery', desc: 'We service your shipments via a diverse operating infrastructure for fastest delivery times.' },
  { icon: Globe2, title: 'Global Coverage', desc: 'US, Europe & Worldwide coverage by sea & air. We offer a broad range of international freight services.' },
  { icon: Clock3, title: '24/7 Support', desc: 'Get excellent 24/7 online support and expert advice from our dedicated customer service team.' },
  { icon: BadgeCheck, title: 'Domestic Services', desc: 'Next business day delivery for time-sensitive parcels with comprehensive domestic coverage.' },
]

export default function WhyUsSection() {
  return (
    <section className="py-20 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr,1.1fr] gap-12 items-start">
          <div>
            <div className="section-subtitle text-brand-400 mb-3">Why Choose Us</div>
            <h2 className="section-title text-white mb-6">
              Trusted by thousands of customers worldwide for reliable and professional logistics solutions.
            </h2>
            <p className="text-gray-300 leading-relaxed mb-8">
              For over 15 years, Midwest Shipment Company has been the logistics backbone for businesses and individuals across Ohio and the greater Midwest. Our commitment to reliability, transparency, and customer satisfaction sets us apart.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { value: '99.2%', label: 'On-Time Delivery' },
                { value: '4.9★', label: 'Customer Rating' },
                { value: '50K+', label: 'Happy Clients' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/5 bg-white/5 px-4 py-5 text-center">
                  <div className="font-display text-2xl font-bold text-brand-300">{item.value}</div>
                  <div className="mt-2 text-[0.65rem] uppercase tracking-[0.2em] text-gray-200">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-[1.25rem] border border-white/5 bg-navy-800 p-5 transition-all duration-200 hover:border-brand-500/50 hover:-translate-y-0.5">
                <Icon className="w-6 h-6 text-brand-300 mb-3" />
                <h4 className="font-display text-white text-sm uppercase tracking-[0.18em] mb-2">{title}</h4>
                <p className="text-gray-300 text-sm leading-6">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}