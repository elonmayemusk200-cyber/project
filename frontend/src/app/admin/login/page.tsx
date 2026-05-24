'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Package, Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  useEffect(() => {
    if (Cookies.get('msc_admin_token')) router.replace('/admin/dashboard')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('All fields required')
    
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      Cookies.set('msc_admin_token', res.data.token, { expires: 7 })
      toast.success(`Welcome back, ${res.data.admin.name}!`)
      router.push('/admin/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      {/* Background Effect */}
      <div className="hero-stripe absolute inset-0" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-500" />
      
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-brand-500 p-3"><Package className="w-7 h-7 text-white" /></div>
            <div className="text-left">
              <div className="font-display text-2xl text-white uppercase font-bold">Midwest</div>
              <div className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em]">Shipment Company</div>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Admin Portal — Authorized Access Only</p>
        </div>

        <div className="bg-white p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-brand-500" />
            <h2 className="font-display text-navy-900 uppercase tracking-wide">Secure Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="input-field pl-10"
                  placeholder="admin@midwestshipment.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-4 mt-2">
              {loading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-400">
            Default: admin@midwestshipment.com / Admin@123456
          </div>
        </div>
      </div>
    </div>
  )
}