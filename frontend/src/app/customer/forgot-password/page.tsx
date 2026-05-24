'use client'

import { useState } from 'react'
import Link from 'next/link'
import customerApi from '@/lib/customerApi'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [password, setPassword] = useState('')

  const requestReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const res = await customerApi.post('/customers/forgot-password', { email })
      setResetToken(res.data.reset_token || '')
      toast.success('Reset token generated.')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to request reset.')
    }
  }

  const reset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      await customerApi.post('/customers/reset-password', { token: resetToken, password })
      toast.success('Password reset. You can login now.')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to reset password.')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2">
        <form onSubmit={requestReset} className="border border-gray-100 bg-white p-6 shadow-sm">
          <p className="section-subtitle">Forgot password</p>
          <h1 className="mt-2 font-display text-3xl uppercase text-navy-900">Request reset</h1>
          <label className="mt-6 block">
            <span className="label">Account email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
          </label>
          <button className="btn-primary mt-5">Generate token</button>
          {resetToken && <p className="mt-4 break-all font-mono text-xs text-brand-700">{resetToken}</p>}
        </form>

        <form onSubmit={reset} className="border border-gray-100 bg-white p-6 shadow-sm">
          <p className="section-subtitle">Reset password</p>
          <h2 className="mt-2 font-display text-3xl uppercase text-navy-900">Set new password</h2>
          <label className="mt-6 block">
            <span className="label">Reset token</span>
            <input required value={resetToken} onChange={(e) => setResetToken(e.target.value)} className="input-field" />
          </label>
          <label className="mt-4 block">
            <span className="label">New password</span>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
          </label>
          <button className="btn-secondary mt-5">Reset password</button>
          <Link href="/customer/login" className="mt-5 block text-sm font-semibold text-brand-600">Return to login</Link>
        </form>
      </div>
    </main>
  )
}
