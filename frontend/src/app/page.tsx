import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import TrackingSection from '@/components/sections/TrackingSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <TrackingSection />
        <ReviewsSection />

        <section className="bg-gradient-to-r from-slate-950 to-navy-800 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="section-subtitle text-brand-200">Ready to Ship with Confidence?</p>
            <h2 className="mt-3 font-display text-4xl text-white uppercase">Build a cleaner, faster logistics plan with our team.</h2>
            <p className="mt-4 text-base leading-7 text-gray-200">
              Contact us for a free quote and experience a logistics partner focused on visibility, security, and premium execution.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary justify-center">
                Get Free Quote
              </Link>
              <Link href="/services" className="btn-outline border-white text-white hover:bg-white hover:text-slate-950 justify-center">
                Explore Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}