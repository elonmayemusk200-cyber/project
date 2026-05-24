'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { MailOpen, CheckCheck, MessageCircleQuestion } from 'lucide-react'

interface ContactMessage {
  id: number
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  is_read: number
  created_at: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  const loadMessages = async () => {
    setLoading(true)
    try {
      const res = await api.get('/contact')
      setMessages(res.data.messages || [])
    } catch (error) {
      toast.error('Unable to load support messages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const markRead = async (id: number) => {
    try {
      await api.put(`/contact/${id}/read`)
      toast.success('Message marked as read.')
      await loadMessages()
    } catch (error) {
      toast.error('Unable to update message status.')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <p className="section-subtitle">Customer support</p>
          <h1 className="section-title text-3xl">Support center</h1>
          <p className="mt-2 text-sm text-gray-600">Review inbound messages, update their status, and keep every customer conversation visible in the admin portal.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-brand-50 p-3 text-brand-500"><MessageCircleQuestion className="w-5 h-5" /></div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Open tickets</p>
                <p className="text-2xl font-bold text-navy-900">{messages.filter((message) => !message.is_read).length}</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-50 p-3 text-green-500"><CheckCheck className="w-5 h-5" /></div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Resolved</p>
                <p className="text-2xl font-bold text-navy-900">{messages.filter((message) => message.is_read).length}</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-50 p-3 text-blue-500"><MailOpen className="w-5 h-5" /></div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Total messages</p>
                <p className="text-2xl font-bold text-navy-900">{messages.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-[0.15em]">
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Message</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">No support messages have been received yet.</td>
                    </tr>
                  ) : (
                    messages.map((message) => (
                      <tr key={message.id} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-navy-900">{message.name}</div>
                          <div className="text-xs text-gray-500">{message.email}</div>
                        </td>
                        <td className="py-3 px-4">{message.subject || 'General inquiry'}</td>
                        <td className="py-3 px-4 max-w-md">
                          <p className="line-clamp-2">{message.message}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold uppercase tracking-wider ${message.is_read ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {message.is_read ? 'Read' : 'Unread'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {!message.is_read && (
                            <button onClick={() => markRead(message.id)} className="text-brand-600 font-semibold hover:text-brand-700">
                              Mark read
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
