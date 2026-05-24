import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Shield, Award, Users, TrendingUp } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="bg-navy-900 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="section-subtitle text-brand-400 mb-3">Our Story</div>
            <h1 className="section-title text-white">About Midwest Shipment Company</h1>
          </div>
        </div>

        <section className="py-20 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="section-title mb-6">Built in Columbus.<br />Built for America.</h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Founded in 2008, Midwest Shipment Company started as a small courier service operating out of Columbus, Ohio. 
                Today, we are one of the Midwest's most trusted logistics providers, handling tens of thousands of shipments monthly.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                Our headquarters at 1450 Industrial Parkway serves as the nerve center for our operations, 
                where our dedicated team of logistics professionals works around the clock to ensure your shipments 
                arrive safely, on time, every time.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Shield, title: 'Fully Licensed & Insured', desc: 'DOT & FMCSA certified carrier' },
                  { icon: Award, title: 'Award Winning', desc: 'BBB A+ rated since 2012' },
                  { icon: Users, title: '200+ Team Members', desc: 'Across Ohio and the Midwest' },
                  { icon: TrendingUp, title: 'Growing Fast', desc: '30% year-over-year growth' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="border border-gray-100 p-4">
                    <Icon className="w-5 h-5 text-brand-500 mb-2" />
                    <p className="font-semibold text-navy-900 text-sm">{title}</p>
                    <p className="text-gray-500 text-xs mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-navy-900 p-10 text-white">
              <div className="section-subtitle text-brand-400 mb-4">Our Mission</div>
              <p className="text-gray-300 leading-relaxed text-lg italic mb-8">
                "To provide every customer — from individual senders to enterprise shippers — 
                with the same level of care, precision, and reliability that defines the Midwest spirit."
              </p>
              <div className="border-t border-navy-700 pt-6 space-y-3">
                {['Customer-first approach to every shipment','Real-time transparency and communication','Environmentally responsible logistics','Community-driven values'].map(v => (
                  <div key={v} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-brand-400 mt-0.5">▶</span>{v}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="section-subtitle mb-3">Our Address</div>
            <h2 className="section-title mb-4">Visit Our Headquarters</h2>
            <p className="text-gray-500 text-lg">1450 Industrial Parkway, Columbus, Ohio, USA</p>
            <p className="text-gray-500">Monday – Friday: 6:00 AM – 8:00 PM ET &nbsp;|&nbsp; Saturday: 8:00 AM – 4:00 PM ET</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}