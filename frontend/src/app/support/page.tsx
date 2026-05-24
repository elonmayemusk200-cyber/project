'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronRight, Clock3, Headphones, Mail, MessageCircle, Phone, Search, ShieldCheck, Truck } from 'lucide-react'

type Message = {
  sender: 'assistant' | 'user'
  text: string
}

const quickTopics = [
  {
    title: 'Track a shipment',
    description: 'Check live status, route progress, and delivery updates.',
    href: '/track',
    icon: Truck,
  },
  {
    title: 'Request a quote',
    description: 'Start a conversation for urgent, secure, or high-volume freight needs.',
    href: '/contact',
    icon: ShieldCheck,
  },
  {
    title: 'Contact support',
    description: 'Reach our team for documentation, scheduling, and account help.',
    href: '/contact',
    icon: Headphones,
  },
]

const faqItems = [
  {
    question: 'How quickly can I get help for an urgent shipment?',
    answer: 'Our support team is available 24/7 and can assist with urgent routing, escalation, and delivery coordination immediately.',
  },
  {
    question: 'Can I track my shipment from the support center?',
    answer: 'Yes. You can jump straight to the tracking page from the quick links or use the chat assistant to get a tracking guide.',
  },
  {
    question: 'Do you offer support for high-value or secure freight?',
    answer: 'Yes. We provide secure-handling support, dedicated coordination, and a direct contact path for sensitive cargo requirements.',
  },
  {
    question: 'What hours is customer support available?',
    answer: 'Support is available around the clock, with response coverage for global shipments and time-sensitive logistics questions.',
  },
]

const cannedReplies = [
  'Thanks for reaching out. If you need help with a live shipment, please share your tracking ID and I will pull the latest status.',
  'We can help with quotes, routing, written confirmation, and secure handling. Let me know the shipment type and destination.',
  'For urgent inquiries, our support team can escalate your request right away. Share your contact details and the issue summary.',
]

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Hi! I am your support assistant. Ask me about tracking, quotes, urgent shipments, or service questions.',
    },
  ])
  const [draft, setDraft] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const assistantCount = useMemo(() => messages.filter((message) => message.sender === 'assistant').length, [messages])

  const handleSend = () => {
    const trimmed = draft.trim()
    if (!trimmed) return

    const lowered = trimmed.toLowerCase()
    let response = cannedReplies[assistantCount % cannedReplies.length]

    if (lowered.includes('track') || lowered.includes('tracking')) {
      response = 'Use the tracking page to check live updates. If you want, I can also guide you to the exact shipment status screen.'
    }

    if (lowered.includes('quote') || lowered.includes('rate')) {
      response = 'I can help you prepare a quote request. Share your origin, destination, cargo type, and preferred shipment timeline.'
    }

    if (lowered.includes('urgent') || lowered.includes('asap')) {
      response = 'We can prioritize urgent support immediately. Share your shipment details and I will route you to the right specialist.'
    }

    setMessages((current) => [
      ...current,
      { sender: 'user', text: trimmed },
      { sender: 'assistant', text: response },
    ])
    setDraft('')
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-navy-800 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div>
              <p className="section-subtitle text-brand-200">Help & Support Center</p>
              <h1 className="mt-3 font-display text-4xl uppercase leading-tight text-white md:text-5xl">
                Support that keeps your shipment moving.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-200">
                Access quick help, real-time guidance, and practical next steps for tracking, quotes, deliveries, and secure logistics coordination.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary justify-center">
                  Contact Support
                </Link>
                <Link href="/track" className="btn-outline border-white text-white hover:bg-white hover:text-slate-950 justify-center">
                  Track Shipment
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-brand-200">Live chat assistant</p>
                    <p className="mt-2 text-sm text-gray-200">Instant help for shipment questions and service directions.</p>
                  </div>
                  <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                    Online
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.sender}-${index}`}
                      className={`max-w-[90%] rounded-[1rem] px-4 py-3 text-sm leading-6 ${
                        message.sender === 'assistant'
                          ? 'bg-white/10 text-white'
                          : 'ml-auto bg-brand-500 text-slate-950'
                      }`}
                    >
                      {message.text}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-3">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        handleSend()
                      }
                    }}
                    placeholder="Ask about tracking, quote, or urgent help"
                    className="flex-1 rounded-[1rem] border border-white/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <button
                    onClick={handleSend}
                    className="inline-flex items-center justify-center rounded-[1rem] bg-brand-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-4 md:grid-cols-3">
              {quickTopics.map(({ title, description, href, icon: Icon }) => (
                <Link
                  key={title}
                  href={href}
                  className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-navy-900">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
                    Explore
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.85fr,1.15fr]">
            <div>
              <p className="section-subtitle">Support Options</p>
              <h2 className="mt-3 section-title text-navy-500">Everything you need for fast answers and dependable follow-up.</h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                From urgent shipment coordination to customer guidance, the support center brings the most common help paths into one place.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: Clock3, title: '24/7 availability', text: 'Reach support around the clock for urgent updates and after-hours questions.' },
                  { icon: Search, title: 'Quick self-service', text: 'Use the chat assistant and resource links to resolve common actions faster.' },
                  { icon: MessageCircle, title: 'Human follow-up', text: 'Escalate important issues and get direct response guidance from our support team.' },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex gap-3 rounded-[1.25rem] border border-gray-100 bg-white px-4 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy-900">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.35)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="section-subtitle">FAQ</p>
                  <h3 className="mt-2 text-2xl font-semibold text-navy-900">Common questions from customers</h3>
                </div>
                <div className="rounded-full bg-brand-50 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-600">
                  Helpful
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {faqItems.map((item, index) => {
                  const isOpen = openFaq === index
                  return (
                    <div key={item.question} className="rounded-[1.25rem] border border-gray-100 bg-gray-50">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                      >
                        <span className="font-semibold text-navy-900">{item.question}</span>
                        <ChevronRight className={`h-4 w-4 shrink-0 text-brand-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                      </button>
                      {isOpen && <p className="px-4 pb-4 text-sm leading-6 text-gray-600">{item.answer}</p>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
              <div className="grid gap-8 md:grid-cols-3">
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-brand-200">Need a direct response?</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">Talk to a support specialist.</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-200">
                  <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-brand-300" /> Toll Free Support</div>
                  <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-brand-300" /> support@midwestshipment.com</div>
                </div>
                <div>
                  <Link href="/contact" className="btn-primary justify-center">
                    Open Support Ticket
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
