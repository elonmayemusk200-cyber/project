'use client'

import { useState } from 'react'
import CustomerLayout from '@/components/layout/CustomerLayout'
import customerApi from '@/lib/customerApi'
import toast from 'react-hot-toast'

export default function CustomerSupportPage() {
  const [form, setForm] = useState({ subject: '', shipment_id: '', message: '' })
  const [sending, setSending] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSending(true)
    try {
      await customerApi.post('/customers/support', {
        subject: form.subject,
        shipment_id: form.shipment_id ? Number(form.shipment_id) : null,
        message: form.message,
      })
      setForm({ subject: '', shipment_id: '', message: '' })
      toast.success('Support request sent.')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to contact support.')
    } finally {
      setSending(false)
    }
  }

  return (
    <CustomerLayout>
      <div className="max-w-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="section-subtitle">Contact support</p>
        <h1 className="section-title text-3xl">Send a support request</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="label">Subject</span>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" />
          </label>
          <label className="block">
            <span className="label">Shipment ID (optional)</span>
            <input type="number" value={form.shipment_id} onChange={(e) => setForm({ ...form, shipment_id: e.target.value })} className="input-field" />
          </label>
          <label className="block">
            <span className="label">Message</span>
            <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field min-h-36" />
          </label>
          <button disabled={sending} className="btn-primary">{sending ? 'Sending...' : 'Send request'}</button>
        </form>
      </div>
    </CustomerLayout>
  )
}
