'use client'

import { useEffect, useState } from 'react'
import CustomerLayout from '@/components/layout/CustomerLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import customerApi from '@/lib/customerApi'
import { formatDateTime } from '@/lib/utils'
import type { CustomerNotification } from '@/types'
import toast from 'react-hot-toast'

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState<CustomerNotification[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await customerApi.get('/customers/notifications')
      setNotifications(res.data.notifications || [])
    } catch {
      toast.error('Unable to load notifications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const markRead = async (id: number) => {
    await customerApi.put(`/customers/notifications/${id}/read`)
    await load()
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <p className="section-subtitle">Notification center</p>
          <h1 className="section-title text-3xl">Notifications</h1>
        </div>
        <div className="border border-gray-100 bg-white p-5 shadow-sm">
          {loading ? <div className="flex justify-center p-8"><LoadingSpinner size="lg" /></div> : (
            <div className="space-y-3">
              {notifications.length === 0 ? <p className="text-sm text-gray-500">No notifications.</p> : notifications.map((item) => (
                <div key={item.id} className={`border p-4 ${item.is_read ? 'border-gray-100 bg-white' : 'border-brand-200 bg-brand-50'}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-navy-900">{item.title}</p>
                      <p className="mt-1 text-sm text-gray-600">{item.message}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-gray-400">{formatDateTime(item.created_at)}</p>
                    </div>
                    {!item.is_read && <button onClick={() => markRead(item.id)} className="text-sm font-semibold text-brand-600">Mark read</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  )
}
