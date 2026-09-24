import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AlarmCard from '../../components/AlarmCard'
import { searchAlarms } from '../../data/mockApi'
import type { Alarm } from '../../types'

type AlarmWithPatient = Alarm & { patient: { name: string } }

export default function Alarms() {
  const [searchTerm, setSearchTerm] = useState('')
  const [alarms, setAlarms] = useState<AlarmWithPatient[]>([])
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState(false)
  const navigate = useNavigate()
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const fetchAlarms = useCallback(async (term: string) => {
    if (term.length < 5) {
      setAlarms([])
      return
    }
    setLoading(true)
    try {
      setAlarms(await searchAlarms(term))
    } catch {
      setAlarms([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    clearTimeout(timerRef.current)
    setTouched(searchTerm.length > 0)
    if (searchTerm.length >= 5) {
      timerRef.current = setTimeout(() => fetchAlarms(searchTerm), 500)
    } else {
      setAlarms([])
    }
    return () => clearTimeout(timerRef.current)
  }, [searchTerm, fetchAlarms])

  const showEmpty = touched && !loading && searchTerm.length >= 5 && alarms.length === 0

  return (
    <div className="bg-gray-100 px-6 pb-6 pt-6">
      <input
        className="mb-4 w-full rounded-md border border-gray-300 bg-white p-2.5 text-base outline-none focus:border-primary"
        placeholder="Buscar por cédula..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm.length > 0 && searchTerm.length < 5 && (
        <p className="mb-2 text-center text-xs text-gray-400">
          Ingresa al menos 5 dígitos de la cédula del paciente.
        </p>
      )}

      {loading && (
        <p className="py-4 text-center text-sm text-gray-500">Buscando...</p>
      )}

      {showEmpty && (
        <p className="py-4 text-center text-gray-500">
          No se encontraron alarmas.
        </p>
      )}

      {alarms.map((alarm) => (
        <AlarmCard
          key={alarm.id}
          name={alarm.patient.name}
          subtext={
            alarm.type.charAt(0).toUpperCase() +
            alarm.type.slice(1).toLowerCase()
          }
          detail={alarm.name}
          hour={alarm.time}
          days={alarm.daysOfWeek}
          onPress={() => navigate(`/admin/alarmas/${alarm.id}`)}
        />
      ))}

      <button
        type="button"
        onClick={() => navigate('/admin/alarmas/nueva')}
        className="my-4 w-full rounded-md bg-primary p-4 text-center text-lg text-white"
      >
        Agregar Alarma
      </button>
    </div>
  )
}
