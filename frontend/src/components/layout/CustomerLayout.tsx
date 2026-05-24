'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { Bell, FileText, Headphones, LayoutDashboard, LogOut, Menu, Package, Settings, Truck, X } from 'lucide-react'
import customerApi from '@/lib/customerApi'
import { cn } from '@/lib/utils'
import type { Customer } from '@/types'

const navItems = [
  { href: '/customer/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/customer/shipments', icon: Truck, label: 'Shipments' },
  { href: '/customer/documents', icon: FileText, label: 'Documents' },
  { href: '/customer/notifications', icon: Bell, label: 'Notifications' },
  { href: '/customer/support', icon: Headphones, label: 'Support' },
  { href: '/customer/profile', icon: Settings, label: 'Profile' },
]

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const token = Cookies.get('msc_customer_token')
    if (!token) {
      router.push('/customer/login')
      return
    }

    customerApi.get('/customers/me')
      .then((res) => setCustomer(res.data.customer))
      .catch(() => {
        Cookies.remove('msc_customer_token')
        router.push('/customer/login')
      })
  }, [router])

  const logout = () => {
    Cookies.remove('msc_customer_token')
    router.push('/customer/login')
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 transition-transform lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/customer/dashboard" className="flex items-center gap-3">
            <div className="bg-brand-500 p-2 text-white">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-bold uppercase text-white">Midwest</p>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-brand-300">Customer Portal</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-3 text-sm font-semibold uppercase tracking-wide transition-colors',
                pathname.startsWith(href) ? 'bg-brand-500 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          {customer && (
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center bg-brand-500 font-bold text-white">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{customer.name}</p>
                <p className="truncate text-xs text-slate-400">{customer.email}</p>
              </div>
            </div>
          )}
          <button onClick={logout} className="flex w-full items-center justify-center gap-2 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-red-500 hover:text-white">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {open && <button aria-label="Close menu" className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <button onClick={() => setOpen((value) => !value)} className="p-2 text-slate-600 lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-500">Customer dashboard</p>
            <p className="text-sm text-slate-500">Track shipments, manage documents, and contact support.</p>
          </div>
          <Link href="/track" className="hidden bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white sm:inline-flex">
            Track
          </Link>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
