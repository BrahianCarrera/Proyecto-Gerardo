import { useState } from 'react'
import { Clock } from 'lucide-react'

interface TimePickerProps {
  time: string | null
  setTime: (t: string | null) => void
}

/** Native-feel time picker: readonly display + modal with hour/minute selects. */
export default function TimePicker({ time, setTime }: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const [hour, setHour] = useState(time?.split(':')[0] ?? '08')
  const [minute, setMinute] = useState(time?.split(':')[1] ?? '00')

  const confirm = () => {
    setTime(`${hour}:${minute}`)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-md border border-gray-300 bg-white p-2 text-left shadow-sm"
      >
        <Clock size={18} className="text-primary" />
        <span className={time ? 'text-base text-gray-900' : 'text-base text-gray-400'}>
          {time ?? 'Asignar hora a la alarma'}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50">
          <div className="w-full rounded-t-2xl bg-white pb-4">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-gray-500"
              >
                Cancelar
              </button>
              <span className="font-semibold text-gray-800">Alarma</span>
              <button
                type="button"
                onClick={confirm}
                className="text-sm font-semibold text-primary"
              >
                Confirmar
              </button>
            </div>
            <div className="flex items-center justify-center gap-4 px-6 py-6">
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="h-40 w-24 rounded-xl border border-gray-200 bg-gray-50 text-center text-2xl font-semibold text-gray-800"
              >
                {Array.from({ length: 24 }, (_, i) =>
                  String(i).padStart(2, '0'),
                ).map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              <span className="text-2xl font-bold text-gray-800">:</span>
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="h-40 w-24 rounded-xl border border-gray-200 bg-gray-50 text-center text-2xl font-semibold text-gray-800"
              >
                {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(
                  (m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
