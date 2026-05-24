'use client'

import Link from 'next/link'
import CustomerLayout from '@/components/layout/CustomerLayout'

export default function CustomerDocumentsPage() {
  return (
    <CustomerLayout>
      <div className="border border-gray-100 bg-white p-6 shadow-sm">
        <p className="section-subtitle">Documents</p>
        <h1 className="section-title text-3xl">Delivery documents</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
          Delivery documents are uploaded from each shipment detail page so they stay attached to the correct package and timeline.
        </p>
        <Link href="/customer/shipments" className="btn-primary mt-6">Open shipment history</Link>
      </div>
    </CustomerLayout>
  )
}
