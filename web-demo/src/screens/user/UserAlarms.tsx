import { useEffect, useState } from 'react'
import { BellRing, CalendarClock } from 'lucide-react'
import AlarmCard from '../../components/AlarmCard'
import Spinner from '../../components/Spinner'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getAlarmsForPatient } from '../../data/mockApi'
import type { Alarm } from '../../types'

export default function UserAlarms() {
  const { user } = useAuth()
  const { show } = useToast()
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      setError('Usuario no autenticado.')
      return
    }
    getAlarmsForPatient(user.id)
      .then(setAlarms)
      .catch(() =>
        setError('No se pudieron cargar las alarmas. Intenta de nuevo más tarde.'),
      )
      .finally(() => setLoading(false))
  }, [user?.id])

  if (loading) return <Spinner text="Cargando alarmas programadas..." />

  if (error)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
        <p className="text-center text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-6 py-2 font-semibold text-white"
        >
          Reintentar
        </button>
      </div>
    )

  return (
    <div className="min-h-full bg-gray-100 px-4 pb-6 pt-4">
      <div className="mb-4 flex items-center gap-2">
        <BellRing size={22} className="text-primary" />
        <h2 className="text-xl font-bold text-gray-800">
          Alarmas programadas
        </h2>
      </div>

      {alarms.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <CalendarClock size={48} className="text-gray-300" />
          <p className="text-lg text-gray-600">
            No tienes alarmas de medicamentos registradas.
          </p>
          <p className="text-sm text-gray-500">
            ¡Agrega tu primera alarma para empezar!
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs leading-relaxed text-gray-700">
            En la app móvil, estas alarmas se programan como notificaciones
            nativas con sonido <strong>alarma.wav</strong>, opción
            «Posponer 5 mins» y sincronización en segundo plano cada 15
            minutos.
            <button
              type="button"
              onClick={() => show('info', 'Alarma de prueba (demo)')}
              className="mt-2 block text-sm font-semibold text-primary underline"
            >
              Probar alarma
            </button>
          </div>

          {alarms.map((alarm) => (
            <AlarmCard
              key={alarm.id}
              name={alarm.name}
              subtext={
                alarm.type.charAt(0).toUpperCase() +
                alarm.type.slice(1).toLowerCase()
              }
              detail={alarm.notes ?? ''}
              hour={alarm.time}
              days={alarm.daysOfWeek}
            />
          ))}
        </>
      )}
    </div>
  )
}
