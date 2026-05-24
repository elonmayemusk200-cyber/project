'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import CustomerLayout from '@/components/layout/CustomerLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import StatusBadge from '@/components/ui/StatusBadge'
import customerApi from '@/lib/customerApi'
import { formatDate, SERVICE_LABELS } from '@/lib/utils'
import type { Shipment } from '@/types'
import toast from 'react-hot-toast'

export default function CustomerShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await customerApi.get('/customers/shipments', { params: { search: search || undefined } })
      setShipments(res.data.shipments || [])
    } catch {
      toast.error('Unable to load shipments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(load, 250)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <p className="section-subtitle">Shipment history</p>
          <h1 className="section-title text-3xl">Your shipments</h1>
        </div>

        <label className="relative block max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tracking code, recipient, or location" className="input-field pl-10" />
        </label>

        <div className="border border-gray-100 bg-white shadow-sm">
          {loading ? (
            <div className="flex justify-center p-8"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-[0.18em] text-gray-500">
                    <th className="px-4 py-3">Tracking</th>
                    <th className="px-4 py-3">Recipient</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Estimate</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No shipments found.</td></tr>
                  ) : shipments.map((shipment) => (
                    <tr key={shipment.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-3 font-mono font-bold text-navy-900">{shipment.tracking_id}</td>
                      <td className="px-4 py-3">{shipment.recipient_name}<div className="text-xs text-gray-500">{shipment.recipient_city}</div></td>
                      <td className="px-4 py-3">{SERVICE_LABELS[shipment.service_type]}</td>
                      <td className="px-4 py-3"><StatusBadge status={shipment.status} size="sm" /></td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(shipment.estimated_delivery || null)}</td>
                      <td className="px-4 py-3"><Link href={`/customer/shipments/${shipment.id}`} className="font-semibold text-brand-600">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  )
}
