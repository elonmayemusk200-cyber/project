'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import customerApi from '@/lib/customerApi'
import toast from 'react-hot-toast'

export default function CustomerRegisterPage() {
  const router = useRouter()
  const [verificationToken, setVerificationToken] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'USA',
  })
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      const res = await customerApi.post('/customers/register', form)
      Cookies.set('msc_customer_token', res.data.token, { expires: 7 })
      setVerificationToken(res.data.verification_token || '')
      toast.success('Account created.')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to create account.')
    } finally {
      setLoading(false)
    }
  }

  const verify = async () => {
    if (!verificationToken) return
    try {
      await customerApi.post('/customers/verify-email', { token: verificationToken })
      toast.success('Email verified.')
      router.push('/customer/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to verify email.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="section-subtitle">Customer registration</p>
        <h1 className="mt-2 font-display text-3xl uppercase text-navy-900">Create your portal account</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="label">Full name</span>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </label>
          <label className="block">
            <span className="label">Email</span>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
          </label>
          <label className="block">
            <span className="label">Password</span>
            <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" />
          </label>
          <label className="block">
            <span className="label">Phone</span>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
          </label>
          <label className="block">
            <span className="label">Country</span>
            <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field" />
          </label>
          <label className="block md:col-span-2">
            <span className="label">Address</span>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" />
          </label>
          <label className="block">
            <span className="label">City</span>
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" />
          </label>
          <label className="block">
            <span className="label">State</span>
            <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field" />
          </label>
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button disabled={loading} className="btn-primary">{loading ? 'Creating...' : 'Create account'}</button>
            <Link href="/customer/login" className="btn-outline">Back to login</Link>
          </div>
        </form>

        {verificationToken && (
          <div className="mt-6 border border-brand-200 bg-brand-50 p-4">
            <p className="font-semibold text-navy-900">Email verification token</p>
            <p className="mt-2 break-all font-mono text-sm text-brand-700">{verificationToken}</p>
            <button onClick={verify} className="btn-secondary mt-4">Verify email</button>
          </div>
        )}
      </div>
    </main>
  )
}
