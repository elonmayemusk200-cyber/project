'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return toast.error('Please fill required fields')
    
    setLoading(true)
    try {
      await api.post('/contact', form)
      toast.success('Message sent! We will get back to you shortly.')
      setForm({ name:'', email:'', phone:'', subject:'', message:'' })
    } catch { 
      toast.error('Failed to send message. Please try again.') 
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="bg-navy-900 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="section-subtitle text-brand-400 mb-3">Get In Touch</div>
            <h1 className="section-title text-white">Contact Us</h1>
          </div>
        </div>

        <section className="py-20 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Sidebar Details */}
            <div className="lg:col-span-1">
              <h2 className="section-title text-2xl mb-6">We're Here to Help</h2>
              <p className="text-gray-500 mb-8">Our customer support team is available to assist you with any questions, quotes, or shipment concerns.</p>
              
              <div className="space-y-5">
                {[
                  { icon: MapPin, title: 'Address', lines: ['1450 Industrial Parkway', 'Columbus, Ohio, USA'] },
                  { icon: Phone, title: 'Phone', lines: ['+1 (614) 555-0123', '+1 (614) 555-0199'] },
                  { icon: Mail, title: 'Email', lines: ['info@midwestshipment.com', 'support@midwestshipment.com'] },
                  { icon: Clock, title: 'Hours', lines: ['Mon–Fri: 6AM – 10PM ET', 'Sat: 8AM – 6PM ET'] },
                ].map(({ icon: Icon, title, lines }) => (
                  <div key={title} className="flex gap-3">
                    <div className="bg-brand-50 p-2.5 h-fit"><Icon className="w-4 h-4 text-brand-500" /></div>
                    <div>
                      <p className="font-semibold text-navy-900 text-sm">{title}</p>
                      {lines.map(l => <p key={l} className="text-gray-500 text-sm">{l}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="label">Full Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field" required /></div>
                  <div><label className="label">Email Address *</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-field" required /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="label">Phone Number</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="input-field" /></div>
                  <div><label className="label">Subject</label><input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} className="input-field" /></div>
                </div>
                <div><label className="label">Message *</label><textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={6} className="input-field resize-none" required /></div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}