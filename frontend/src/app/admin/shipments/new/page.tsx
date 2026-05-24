'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const emptyForm = {
  sender_name: '',
  sender_email: '',
  sender_phone: '',
  sender_address: '',
  sender_city: '',
  sender_state: 'OH',
  sender_country: 'USA',
  sender_zip: '',
  recipient_name: '',
  recipient_email: '',
  recipient_phone: '',
  recipient_address: '',
  recipient_city: '',
  recipient_state: 'OH',
  recipient_country: 'USA',
  recipient_zip: '',
  description: '',
  weight: '',
  weight_unit: 'lbs',
  dimensions: '',
  package_type: 'box',
  declared_value: '',
  service_type: 'standard',
  status: 'processing',
  priority: 'normal',
  ship_date: '',
  estimated_delivery: '',
  current_location: 'Columbus, Ohio',
  notes: '',
  admin_notes: '',
}

export default function CreateShipmentPage() {
  const router = useRouter()
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        ...form,
        weight: form.weight ? Number(form.weight) : null,
        declared_value: form.declared_value ? Number(form.declared_value) : null,
      }

      await api.post('/shipments', payload)
      toast.success('Shipment created successfully.')
      router.push('/admin/shipments')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to create shipment.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <p className="section-subtitle">Shipment creation</p>
          <h1 className="section-title text-3xl">Create new shipment</h1>
          <p className="mt-2 text-sm text-gray-600">Add the shipment details required to route, track, and manage the package in the admin portal.</p>
        </div>

        <div className="card p-5">
          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h2 className="text-lg font-bold text-navy-900">Sender details</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="label">Sender name</span>
                  <input required value={form.sender_name} onChange={(e) => handleChange('sender_name', e.target.value)} className="input-field" />
                </label>
                <label className="block">
                  <span className="label">Sender email</span>
                  <input type="email" value={form.sender_email} onChange={(e) => handleChange('sender_email', e.target.value)} className="input-field" />
                </label>
                <label className="block">
                  <span className="label">Sender phone</span>
                  <input value={form.sender_phone} onChange={(e) => handleChange('sender_phone', e.target.value)} className="input-field" />
                </label>
                <label className="block">
                  <span className="label">Sender ZIP</span>
                  <input value={form.sender_zip} onChange={(e) => handleChange('sender_zip', e.target.value)} className="input-field" />
                </label>
                <label className="block md:col-span-2">
                  <span className="label">Sender address</span>
                  <input required value={form.sender_address} onChange={(e) => handleChange('sender_address', e.target.value)} className="input-field" />
                </label>
                <label className="block">
                  <span className="label">Sender city</span>
                  <input required value={form.sender_city} onChange={(e) => handleChange('sender_city', e.target.value)} className="input-field" />
                </label>
                <label className="block">
                  <span className="label">Sender state</span>
                  <input value={form.sender_state} onChange={(e) => handleChange('sender_state', e.target.value)} className="input-field" />
                </label>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy-900">Recipient details</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="label">Recipient name</span>
                  <input required value={form.recipient_name} onChange={(e) => handleChange('recipient_name', e.target.value)} className="input-field" />
                </label>
                <label className="block">
                  <span className="label">Recipient email</span>
                  <input type="email" value={form.recipient_email} onChange={(e) => handleChange('recipient_email', e.target.value)} className="input-field" />
                </label>
                <label className="block">
                  <span className="label">Recipient phone</span>
                  <input value={form.recipient_phone} onChange={(e) => handleChange('recipient_phone', e.target.value)} className="input-field" />
                </label>
                <label className="block">
                  <span className="label">Recipient ZIP</span>
                  <input value={form.recipient_zip} onChange={(e) => handleChange('recipient_zip', e.target.value)} className="input-field" />
                </label>
                <label className="block md:col-span-2">
                  <span className="label">Recipient address</span>
                  <input required value={form.recipient_address} onChange={(e) => handleChange('recipient_address', e.target.value)} className="input-field" />
                </label>
                <label className="block">
                  <span className="label">Recipient city</span>
                  <input required value={form.recipient_city} onChange={(e) => handleChange('recipient_city', e.target.value)} className="input-field" />
                </label>
                <label className="block">
                  <span className="label">Recipient state</span>
                  <input value={form.recipient_state} onChange={(e) => handleChange('recipient_state', e.target.value)} className="input-field" />
                </label>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy-900">Shipment details</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="label">Package type</span>
                  <input value={form.package_type} onChange={(e) => handleChange('package_type', e.target.value)} className="input-field" />
                </label>
                <label className="block">
                  <span className="label">Dimensions</span>
                  <input value={form.dimensions} onChange={(e) => handleChange('dimensions', e.target.value)} className="input-field" placeholder="12x10x8" />
                </label>
                <label className="block">
                  <span className="label">Weight</span>
                  <input type="number" value={form.weight} onChange={(e) => handleChange('weight', e.target.value)} className="input-field" />
                </label>
                <label className="block">
                  <span className="label">Weight unit</span>
                  <select value={form.weight_unit} onChange={(e) => handleChange('weight_unit', e.target.value)} className="input-field">
                    <option value="lbs">lbs</option>
                    <option value="kg">kg</option>
                  </select>
                </label>
                <label className="block">
                  <span className="label">Service type</span>
                  <select value={form.service_type} onChange={(e) => handleChange('service_type', e.target.value)} className="input-field">
                    <option value="standard">Standard</option>
                    <option value="express">Express</option>
                    <option value="overnight">Overnight</option>
                    <option value="freight">Freight</option>
                  </select>
                </label>
                <label className="block">
                  <span className="label">Priority</span>
                  <select value={form.priority} onChange={(e) => handleChange('priority', e.target.value)} className="input-field">
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </label>
                <label className="block">
                  <span className="label">Status</span>
                  <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="input-field">
                    <option value="processing">Processing</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In transit</option>
                    <option value="customs_clearance">Customs clearance</option>
                    <option value="arrived_at_facility">Arrived at facility</option>
                    <option value="out_for_delivery">Out for delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed_delivery">Failed delivery</option>
                  </select>
                </label>
                <label className="block">
                  <span className="label">Declared value</span>
                  <input type="number" value={form.declared_value} onChange={(e) => handleChange('declared_value', e.target.value)} className="input-field" />
                </label>
                <label className="block">
                  <span className="label">Ship date</span>
                  <input type="date" value={form.ship_date} onChange={(e) => handleChange('ship_date', e.target.value)} className="input-field" />
                </label>
                <label className="block">
                  <span className="label">Estimated delivery</span>
                  <input type="date" value={form.estimated_delivery} onChange={(e) => handleChange('estimated_delivery', e.target.value)} className="input-field" />
                </label>
                <label className="block">
                  <span className="label">Current location</span>
                  <input value={form.current_location} onChange={(e) => handleChange('current_location', e.target.value)} className="input-field" />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="label">Description</span>
                <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="input-field min-h-28" />
              </label>
              <label className="mt-4 block">
                <span className="label">Internal notes</span>
                <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} className="input-field min-h-28" />
              </label>
              <label className="mt-4 block">
                <span className="label">Admin notes</span>
                <textarea value={form.admin_notes} onChange={(e) => handleChange('admin_notes', e.target.value)} className="input-field min-h-28" />
              </label>
            </section>

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Saving...' : 'Create shipment'}
              </button>
              <button type="button" onClick={() => router.push('/admin/shipments')} className="btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
