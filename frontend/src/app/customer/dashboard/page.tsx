'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowRight, Bell, CheckCircle2, Package, Truck } from 'lucide-react'
import CustomerLayout from '@/components/layout/CustomerLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import StatusBadge from '@/components/ui/StatusBadge'
import customerApi from '@/lib/customerApi'
import { formatDate } from '@/lib/utils'
import type { CustomerNotification, Shipment } from '@/types'
import toast from 'react-hot-toast'

export default function CustomerDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({ total: 0, active: 0, delivered: 0, attention: 0 })
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [notifications, setNotifications] = useState<CustomerNotification[]>([])

  useEffect(() => {
    customerApi.get('/customers/dashboard')
      .then((res) => {
        setSummary(res.data.summary)
        setShipments(res.data.recentShipments || [])
        setNotifications(res.data.notifications || [])
      })
      .catch(() => toast.error('Unable to load dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <CustomerLayout>
      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="space-y-6">
          <div>
            <p className="section-subtitle">Overview</p>
            <h1 className="section-title text-3xl">Shipment dashboard</h1>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Total shipments', value: summary.total, icon: Package, color: 'bg-brand-50 text-brand-600' },
              { label: 'Active', value: summary.active, icon: Truck, color: 'bg-blue-50 text-blue-600' },
              { label: 'Delivered', value: summary.delivered, icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
              { label: 'Needs attention', value: summary.attention, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">{label}</p>
                  <div className={`p-3 ${color}`}><Icon className="h-5 w-5" /></div>
                </div>
                <p className="mt-4 text-3xl font-bold text-navy-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-navy-900">Recent shipments</h2>
                <Link href="/customer/shipments" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600">View all <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <div className="mt-4 space-y-3">
                {shipments.length === 0 ? (
                  <p className="text-sm text-gray-500">No shipments linked to your account yet.</p>
                ) : shipments.map((shipment) => (
                  <Link key={shipment.id} href={`/customer/shipments/${shipment.id}`} className="flex flex-col gap-3 border border-gray-100 p-4 hover:border-brand-300 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-mono font-bold text-navy-900">{shipment.tracking_id}</p>
                      <p className="text-sm text-gray-500">{shipment.recipient_city}, {shipment.recipient_country}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{formatDate(shipment.estimated_delivery || null)}</span>
                      <StatusBadge status={shipment.status} size="sm" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-brand-500" />
                <h2 className="text-xl font-bold text-navy-900">Notifications</h2>
              </div>
              <div className="mt-4 space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500">No notifications yet.</p>
                ) : notifications.map((notification) => (
                  <div key={notification.id} className="border border-gray-100 p-3">
                    <p className="font-semibold text-navy-900">{notification.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  )
}
