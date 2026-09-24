import { useEffect, useState } from 'react'
import MedCard from '../../components/MedCard'
import Spinner from '../../components/Spinner'
import ConfirmModal from '../../components/ConfirmModal'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import {
  getAlarmsForPatient,
  getCaregiverPatients,
} from '../../data/mockApi'
import type { Alarm, Patient } from '../../types'

const DAYS_MAP: Record<number, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
}

interface Med extends Alarm {
  isTaken: boolean
}

export default function UserMeds() {
  const { user } = useAuth()
  const { show } = useToast()
  const [meds, setMeds] = useState<Med[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [patients, setPatients] = useState<Pick<Patient, 'id' | 'name'>[]>([])
  const [caregiverPatientId, setCaregiverPatientId] = useState('')
  const [displayPatientId, setDisplayPatientId] = useState<string | null>(null)
  const [confirmMed, setConfirmMed] = useState<Med | null>(null)

  const loadMeds = async (patientId: string) => {
    setLoading(true)
    setError(null)
    try {
      const alarms = await getAlarmsForPatient(patientId)
      setMeds(alarms.map((a) => ({ ...a, isTaken: false })))
      setDisplayPatientId(patientId)
    } catch {
      setError('Error al cargar las medicinas. Verifique el ID del paciente.')
      setDisplayPatientId(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    if (user.role === 'PACIENTE') {
      loadMeds(user.id)
    } else if (user.role === 'CUIDADOR') {
      getCaregiverPatients(user.id)
        .then(setPatients)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.role])

  const today = new Date().getDay()
  const todays = meds
    .filter((m) => m.daysOfWeek.includes(today))
    .sort((a, b) => a.time.localeCompare(b.time))

  const requestToggle = (med: Med) => {
    if (!(user?.role === 'PACIENTE' || (user?.role === 'CUIDADOR' && displayPatientId))) {
      show('info', 'Selecciona un paciente para registrar el consumo.')
      return
    }
    setConfirmMed(med)
  }

  const applyToggle = () => {
    if (!confirmMed) return
    setMeds((prev) =>
      prev.map((m) =>
        m.id === confirmMed.id ? { ...m, isTaken: !m.isTaken } : m,
      ),
    )
    show('info', 'Estado de medicina actualizado')
    setConfirmMed(null)
  }

  if (loading && user?.role !== 'CUIDADOR')
    return (
      <Spinner
        text={user?.role === 'PACIENTE' ? 'Cargando tus medicinas...' : 'Cargando...'}
      />
    )

  if (loading && user?.role === 'CUIDADOR' && !displayPatientId && patients.length === 0)
    return <Spinner text="Cargando pacientes..." />

  return (
    <div className="min-h-full p-2">
      {user?.role === 'CUIDADOR' && (
        <div className="border-b border-gray-200 bg-gray-100 p-4">
          <p className="mb-2 text-lg font-bold">Ver Medicinas de Paciente</p>
          <select
            className="w-full rounded-xl border border-gray-300 bg-white p-3"
            value={caregiverPatientId}
            onChange={(e) => {
              const v = e.target.value
              setCaregiverPatientId(v)
              if (v) loadMeds(v)
            }}
          >
            <option value="" disabled>
              Seleccione un paciente...
            </option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (ID: {p.id})
              </option>
            ))}
          </select>
          {displayPatientId && (
            <p className="mt-2 text-sm text-gray-600">
              Mostrando medicinas para: {displayPatientId}
            </p>
          )}
          {patients.length === 0 && !loading && (
            <p className="mt-2 text-sm text-gray-500">
              No tienes pacientes vinculados. Envía una solicitud desde tu
              perfil.
            </p>
          )}
        </div>
      )}

      {loading && user?.role === 'CUIDADOR' && displayPatientId && (
        <Spinner text="Cargando medicinas del paciente..." />
      )}

      {error && !loading && (
        <div className="flex h-40 items-center justify-center p-4">
          <p className="text-center text-lg text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && meds.length > 0 && (
        <div className="pb-4">
          <div className="mb-4 rounded-xl bg-purple-100 p-2">
            <p className="text-center text-2xl font-bold capitalize text-gray-800">
              Medicinas para hoy: {DAYS_MAP[today]}
            </p>
          </div>

          {todays.length > 0 ? (
            todays.map((med) => (
              <button
                key={med.id}
                type="button"
                onClick={() => requestToggle(med)}
                className="block w-full text-left"
              >
                <MedCard
                  name={med.name}
                  times={[med.time]}
                  isTaken={med.isTaken}
                />
              </button>
            ))
          ) : (
            <div className="items-center justify-center rounded-xl bg-white p-4 text-center shadow-md">
              <p className="text-lg text-gray-600">
                No hay medicinas programadas para hoy para este paciente.
              </p>
            </div>
          )}
        </div>
      )}

      {!loading && !error && meds.length === 0 && (
        <div className="flex h-40 items-center justify-center p-4">
          <p className="text-center text-lg text-gray-600">
            {user?.role === 'PACIENTE'
              ? 'No hay medicinas programadas para ti.'
              : displayPatientId
                ? 'No hay medicinas para este paciente o no están programadas.'
                : 'Seleccione un paciente para ver sus medicinas.'}
          </p>
        </div>
      )}

      <ConfirmModal
        open={confirmMed !== null}
        danger={false}
        title={
          confirmMed?.isTaken
            ? '¿Desmarcar como tomada?'
            : '¿Marcar como tomada?'
        }
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        onConfirm={applyToggle}
        onCancel={() => setConfirmMed(null)}
      />
    </div>
  )
}
