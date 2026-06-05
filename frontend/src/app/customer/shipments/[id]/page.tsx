export const runtime = 'edge';
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { CalendarDays, Clock3, FileText, MapPin, Package, Upload } from 'lucide-react'
import CustomerLayout from '@/components/layout/CustomerLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import StatusBadge from '@/components/ui/StatusBadge'
import customerApi from '@/lib/customerApi'
import { formatDate, formatDateTime, SERVICE_LABELS, STATUS_LABELS } from '@/lib/utils'
import type { CustomerDocument, Shipment, TrackingEvent } from '@/types'
import toast from 'react-hot-toast'

const statusFlow = ['processing', 'picked_up', 'in_transit', 'customs_clearance', 'arrived_at_facility', 'out_for_delivery', 'delivered']

export default function CustomerShipmentDetailPage() {
  const params = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [events, setEvents] = useState<TrackingEvent[]>([])
  const [documents, setDocuments] = useState<CustomerDocument[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('delivery_document')

  const activeIndex = useMemo(() => {
    if (!shipment) return 0
    if (shipment.status === 'failed_delivery') return statusFlow.indexOf('out_for_delivery')
    return Math.max(0, statusFlow.indexOf(shipment.status))
  }, [shipment])

  const load = async () => {
    setLoading(true)
    try {
      const res = await customerApi.get(`/customers/shipments/${params.id}`)
      setShipment(res.data.shipment)
      setEvents(res.data.events || [])
      setDocuments(res.data.documents || [])
    } catch {
      toast.error('Unable to load shipment.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [params.id])

  const upload = async () => {
    if (!file) {
      toast.error('Choose a file first.')
      return
    }
    const fd = new FormData()
    fd.append('file', file)
    fd.append('document_type', documentType)
    try {
      await customerApi.post(`/customers/shipments/${params.id}/documents`, fd)
      toast.success('Document uploaded.')
      setFile(null)
      await load()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to upload document.')
    }
  }

  return (
    <CustomerLayout>
      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : shipment && (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-subtitle">Live tracking</p>
              <h1 className="section-title text-3xl">{shipment.tracking_id}</h1>
            </div>
            <StatusBadge status={shipment.status} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-navy-900">Shipment status timeline</h2>
              <div className="mt-7 grid grid-cols-4 gap-3 md:grid-cols-7">
                {statusFlow.map((status, index) => {
                  const active = index <= activeIndex
                  return (
                    <div key={status} className="text-center">
                      <div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${active ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-400'}`}>{index + 1}</div>
                      <p className={`mt-2 text-[0.65rem] font-bold uppercase tracking-[0.12em] ${active ? 'text-brand-700' : 'text-gray-400'}`}>{STATUS_LABELS[status]}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="border border-gray-100 bg-white p-4"><MapPin className="h-5 w-5 text-brand-500" /><p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-500">Location</p><p className="font-semibold text-navy-900">{shipment.current_location || 'Pending'}</p></div>
              <div className="border border-gray-100 bg-white p-4"><CalendarDays className="h-5 w-5 text-brand-500" /><p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-500">Estimate</p><p className="font-semibold text-navy-900">{formatDate(shipment.estimated_delivery || null)}</p></div>
              <div className="border border-gray-100 bg-white p-4"><Package className="h-5 w-5 text-brand-500" /><p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-500">Service</p><p className="font-semibold text-navy-900">{SERVICE_LABELS[shipment.service_type]}</p></div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
            <div className="border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-navy-900">Timeline history</h2>
              <div className="mt-5 space-y-4">
                {events.length === 0 ? <p className="text-sm text-gray-500">No events yet.</p> : events.map((event, index) => (
                  <div key={event.id} className="flex gap-3">
                    <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${index === 0 ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-500'}`}><Clock3 className="h-4 w-4" /></div>
                    <div>
                      <p className="font-semibold text-navy-900">{event.status}</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                      <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-gray-400">{formatDateTime(event.event_time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-bold text-navy-900"><FileText className="h-5 w-5 text-brand-500" /> Delivery documents</h2>
              <div className="mt-4 space-y-3">
                <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="input-field">
                  <option value="delivery_document">Delivery document</option>
                  <option value="invoice">Invoice</option>
                  <option value="customs_document">Customs document</option>
                  <option value="proof_of_identity">Proof of identity</option>
                </select>
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-600 file:mr-4 file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-white" />
                <button onClick={upload} className="btn-primary w-full justify-center"><Upload className="h-4 w-4" /> Upload document</button>
              </div>
              <div className="mt-5 space-y-2">
                {documents.length === 0 ? <p className="text-sm text-gray-500">No documents uploaded.</p> : documents.map((doc) => (
                  <div key={doc.id} className="border border-gray-100 p-3 text-sm">
                    <p className="font-semibold text-navy-900">{doc.original_name}</p>
                    <p className="text-gray-500">{doc.document_type.replace(/_/g, ' ')} - {formatDateTime(doc.uploaded_at)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  )
}
