'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ChevronRight, Headphones, MessageCircle, Phone, X } from 'lucide-react'

type Message = {
  sender: 'assistant' | 'user'
  text: string
}

const cannedReplies = [
  'Thanks for reaching out. If you need a quick answer, share your tracking ID or shipment type and I will guide you.',
  'We can help with quotes, urgent shipments, and secure handling. Tell me what you need and I will route you to the right support path.',
  'For immediate escalation, share your contact details and the issue summary so our team can respond quickly.',
]

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Hi! I am your support assistant. Ask about tracking, quotes, or urgent help.',
    },
  ])

  const assistantCount = useMemo(
    () => messages.filter((message) => message.sender === 'assistant').length,
    [messages]
  )

  const handleSend = () => {
    const trimmed = draft.trim()
    if (!trimmed) return

    const lowered = trimmed.toLowerCase()
    let response = cannedReplies[assistantCount % cannedReplies.length]

    if (lowered.includes('track') || lowered.includes('tracking')) {
      response = 'Use the tracking page to review live status updates. I can also help you get to the right shipment details.'
    }

    if (lowered.includes('quote') || lowered.includes('rate')) {
      response = 'I can help prepare a quote request. Share origin, destination, cargo type, and your preferred timeline.'
    }

    if (lowered.includes('urgent') || lowered.includes('asap')) {
      response = 'We can prioritize urgent support immediately. Share your shipment details and I will direct you to the right specialist.'
    }

    setMessages((current) => [
      ...current,
      { sender: 'user', text: trimmed },
      { sender: 'assistant', text: response },
    ])
    setDraft('')
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="w-[22rem] max-w-[calc(100vw-2rem)] rounded-[1.5rem] border border-gray-100 bg-white shadow-[0_30px_80px_-35px_rgba(15,23,42,0.75)]">
          <div className="rounded-t-[1.5rem] bg-slate-950 px-4 py-4 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-brand-200">Support widget</p>
                <h2 className="mt-2 text-base font-semibold">Need help now?</h2>
              </div>
              <button
                type="button"
                aria-label="Close support widget"
                onClick={() => setOpen(false)}
                className="rounded-full bg-white/10 p-2 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="px-4 pb-4 pt-3">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.sender}-${index}`}
                  className={`max-w-[90%] rounded-[1rem] px-3 py-2 text-sm leading-6 ${
                    message.sender === 'assistant'
                      ? 'bg-gray-100 text-slate-900'
                      : 'ml-auto bg-brand-500 text-slate-950'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[1.25rem] border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                <Headphones className="h-4 w-4 text-brand-500" />
                Need direct human support?
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <a href="mailto:support@midwestshipment.com" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-slate-900">
                  <MessageCircle className="h-3.5 w-3.5 text-brand-500" />
                  Email
                </a>
                <a href="tel:+16145550123" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-slate-900">
                  <Phone className="h-3.5 w-3.5 text-brand-500" />
                  Call
                </a>
                <Link href="/support" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-slate-900">
                  Support center
                  <ChevronRight className="h-3.5 w-3.5 text-brand-500" />
                </Link>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask a support question"
                className="flex-1 rounded-[1rem] border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={handleSend}
                className="rounded-[1rem] bg-brand-500 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label="Open support chat"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_20px_60px_-25px_rgba(15,23,42,0.85)]"
      >
        <MessageCircle className="h-4 w-4 text-brand-300" />
        Support
      </button>
    </div>
  )
}
