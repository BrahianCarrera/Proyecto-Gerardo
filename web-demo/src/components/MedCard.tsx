import { Pill } from 'lucide-react'

interface MedCardProps {
  name: string
  times: string[]
  isTaken?: boolean
}

function formatTime(timeString: string) {
  const [hours, minutes] = timeString.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return timeString
  const date = new Date()
  date.setHours(hours, minutes)
  return new Intl.DateTimeFormat('es-ES', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export default function MedCard({ name, times, isTaken = false }: MedCardProps) {
  return (
    <div
      className={`mb-4 flex items-center gap-4 rounded-2xl p-4 shadow-md ${
        isTaken ? 'border border-green-400 bg-green-100' : 'bg-white'
      }`}
    >
      <div
        className={`rounded-xl p-3 ${
          isTaken ? 'bg-green-200' : 'bg-purple-100'
        }`}
      >
        <Pill
          size={24}
          className={isTaken ? 'text-green-700' : 'text-purple-600'}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-base font-semibold ${
            isTaken ? 'text-green-800 line-through' : 'text-gray-800'
          }`}
        >
          {name}
        </p>
        <div className="mt-1 flex flex-wrap gap-2">
          {times.map((time, i) => (
            <span
              key={i}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isTaken
                  ? 'bg-green-300 text-green-900'
                  : 'bg-gray-300 text-gray-900'
              }`}
            >
              {formatTime(time)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
