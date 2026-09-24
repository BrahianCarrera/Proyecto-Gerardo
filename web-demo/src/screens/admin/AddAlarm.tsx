import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StackHeader from '../../components/StackHeader'
import TimePicker from '../../components/TimePicker'
import DayPicker from '../../components/DayPicker'
import { useToast } from '../../context/ToastContext'
import { createAlarm } from '../../data/mockApi'

const inputCls =
  'w-full rounded border border-gray-300 bg-white p-2 text-base shadow-sm outline-none focus:border-primary'
const sectionLabel = 'text-lg text-gray-800'

export function AlarmForm({
  initialValues,
  submitLabel,
  onSubmit,
  readOnlyPatientId = false,
}: {
  initialValues?: {
    patientId: string
    name: string
    type: string
    time: string
    daysOfWeek: number[]
    notes: string
  }
  submitLabel: string
  onSubmit: (payload: {
    patientId: string
    name: string
    type: string
    time: string
    daysOfWeek: number[]
    notes: string
  }) => Promise<void>
  readOnlyPatientId?: boolean
}) {
  const [patientId, setPatientId] = useState(initialValues?.patientId ?? '')
  const [name, setName] = useState(initialValues?.name ?? '')
  const [type, setType] = useState(initialValues?.type ?? '')
  const [notes, setNotes] = useState(initialValues?.notes ?? '')
  const [time, setTime] = useState<string | null>(initialValues?.time ?? null)
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(
    initialValues?.daysOfWeek ?? [],
  )
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientId.trim()) return setError('Debes ingresar la cédula del paciente')
    if (!name.trim()) return setError('Debes ingresar un nombre para la alarma')
    if (!type) return setError('Debes seleccionar un tipo de alarma')
    if (!time) return setError('Debes seleccionar una hora')
    if (daysOfWeek.length === 0)
      return setError('Debes seleccionar al menos un día')

    setError(null)
    setSubmitting(true)
    try {
      await onSubmit({
        patientId: patientId.trim(),
        name: name.trim(),
        type,
        time: time!,
        daysOfWeek: [...daysOfWeek].sort(),
        notes,
      })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="m-4 rounded-md border border-gray-300 bg-background p-5 shadow"
    >
      <div>
        <label className={sectionLabel}>
          Número de cédula del paciente
        </label>
        <p className="text-sm text-gray-500">
          Ingresa el numero sin puntos ni comas
        </p>
        <input
          className={`${inputCls} mb-4 mt-1`}
          value={patientId}
          placeholder="1194075221"
          readOnly={readOnlyPatientId}
          onChange={(e) => setPatientId(e.target.value)}
          inputMode="numeric"
        />
      </div>

      <div>
        <label className={sectionLabel}>Nombre de la alarma</label>
        <input
          className={`${inputCls} mb-4 mt-1`}
          value={name}
          placeholder="Vitamina C"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className={sectionLabel}>Tipo de alarma</label>
        <select
          className={`${inputCls} mb-4 mt-1`}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="" disabled>
            Selecciona un tipo...
          </option>
          <option value="SUPLEMENTO">Suplemento</option>
          <option value="MEDICAMENTO">Medicamento</option>
        </select>
      </div>

      <div className="relative mb-4">
        <label className="text-xl text-gray-800">Hora</label>
        <div className="mt-1">
          <TimePicker time={time} setTime={setTime} />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xl text-gray-800">Días de la semana</label>
        <div className="mt-2">
          <DayPicker selectedDays={daysOfWeek} setSelectedDays={setDaysOfWeek} />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xl text-gray-800">Notas</label>
        <textarea
          className={`${inputCls} mt-1 h-28`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Escribe las notas de la alarma aquí..."
        />
      </div>

      {error && (
        <p className="my-2 text-center text-base font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={`my-2 w-full rounded-xl p-4 text-lg text-white shadow-md transition ${
          submitting ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'
        }`}
      >
        {submitting ? 'Guardando...' : submitLabel}
      </button>
    </form>
  )
}

export default function AddAlarm() {
  const navigate = useNavigate()
  const { show } = useToast()

  return (
    <>
      <StackHeader title="Agregar Alarma" />
      <AlarmForm
        submitLabel="Agregar Alarma"
        onSubmit={async (payload) => {
          await createAlarm(payload)
          show('success', 'Alarma creada correctamente')
          navigate('/admin/alarmas')
        }}
      />
    </>
  )
}
