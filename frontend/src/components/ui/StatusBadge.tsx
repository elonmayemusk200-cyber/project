import { cn, STATUS_LABELS, getStatusColor } from '@/lib/utils'

export default function StatusBadge({ status, size = 'md' }: { status: string; size?: 'sm' | 'md' }) {
  return (
    <span className={cn(
      'inline-flex items-center font-semibold uppercase tracking-wider border',
      getStatusColor(status),
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {STATUS_LABELS[status] || status}
    </span>
  )
}