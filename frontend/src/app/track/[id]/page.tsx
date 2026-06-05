export const runtime = 'edge';
import { redirect } from 'next/navigation'

export default function TrackingResult({ params }: { params: { id: string } }) {
  redirect(`/track?id=${encodeURIComponent(params.id)}`)
}
