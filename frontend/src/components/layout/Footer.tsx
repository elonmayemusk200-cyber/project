import Link from 'next/link'
import { Mail, MapPin, Phone, Package, Send } from 'lucide-react'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Our Services', href: '/services' },
  { label: 'Track Shipment', href: '/track' },
  { label: 'Support Center', href: '/support' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Diplomatic Services', href: '/services' },
]

const socials = [
  { name: 'Support', icon: Send, href: '#' },
  { name: 'Email', icon: Mail, href: 'mailto:info@midwestshipment.com' },
  { name: 'Phone', icon: Phone, href: '#' },
  { name: 'Address', icon: MapPin, href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid gap-10 md:grid-cols-[1.1fr,0.7fr,1fr]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-brand-500 p-2">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-display text-lg font-bold uppercase">Midwest</div>
                <div className="text-brand-400 text-[10px] font-bold uppercase tracking-widest">Shipment Company</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-7">
              Providing Smart Logistics Solutions Across The World. We deliver excellence in shipping, courier services, and package tracking with our global network of trusted partners.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map(({ name, icon: Icon, href }) => (
                <a key={name} href={href} aria-label={name} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-brand-500">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-300 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-brand-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-300 mb-4">Contact Info</h4>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                <div>
                  <p className="font-semibold text-white">Email Us</p>
                  <a href="mailto:info@midwestshipment.com" className="hover:text-brand-300">info@midwestshipment.com</a>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                <div>
                  <p className="font-semibold text-white">Call Us</p>
                  <p>TOLL FREE Support</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                <div>
                  <p className="font-semibold text-white">Working Hours</p>
                  <p>24/7 Global Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-gray-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Midwest Shipment Company. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-300">Privacy Policy</a>
            <a href="#" className="hover:text-brand-300">Terms of Service</a>
            <a href="#" className="hover:text-brand-300">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}