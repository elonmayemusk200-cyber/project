'use client'

import { useEffect, useState } from 'react'
import CustomerLayout from '@/components/layout/CustomerLayout'
import customerApi from '@/lib/customerApi'
import type { Customer } from '@/types'
import toast from 'react-hot-toast'

export default function CustomerProfilePage() {
  const [form, setForm] = useState<Partial<Customer>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    customerApi.get('/customers/me').then((res) => setForm(res.data.customer))
  }, [])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    try {
      const res = await customerApi.put('/customers/profile', form)
      setForm(res.data.customer)
      toast.success('Profile updated.')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to update profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <CustomerLayout>
      <div className="max-w-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="section-subtitle">Profile settings</p>
        <h1 className="section-title text-3xl">Account profile</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
          {(['name', 'phone', 'address', 'city', 'state', 'country'] as const).map((field) => (
            <label key={field} className={`block ${field === 'address' ? 'md:col-span-2' : ''}`}>
              <span className="label">{field.replace('_', ' ')}</span>
              <input value={(form[field] as string) || ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="input-field" />
            </label>
          ))}
          <label className="block md:col-span-2">
            <span className="label">Email</span>
            <input value={form.email || ''} disabled className="input-field bg-gray-50 text-gray-500" />
          </label>
          <button disabled={saving} className="btn-primary md:col-span-2">{saving ? 'Saving...' : 'Save profile'}</button>
        </form>
      </div>
    </CustomerLayout>
  )
}
