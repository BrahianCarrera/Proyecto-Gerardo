import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StackHeader from '../../components/StackHeader'
import Spinner from '../../components/Spinner'
import { useToast } from '../../context/ToastContext'
import { deleteAlarm, getAlarmById, updateAlarm } from '../../data/mockApi'
import { AlarmForm } from './AddAlarm'
import type { Alarm } from '../../types'

export default function EditAlarm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { show } = useToast()
  const [alarm, setAlarm] = useState<Alarm | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getAlarmById(id)
      .then(setAlarm)
      .catch(() => show('error', 'Failed to load alarm'))
      .finally(() => setLoading(false))
  }, [id, show])

  if (loading || !alarm)
    return (
      <>
        <StackHeader title="Editar Alarma" />
        <Spinner text="Cargando alarma..." />
      </>
    )

  return (
    <>
      <StackHeader title="Editar Alarma" />
      <AlarmForm
        readOnlyPatientId
        initialValues={{
          patientId: alarm.patientId,
          name: alarm.name,
          type: alarm.type,
          time: alarm.time,
          daysOfWeek: alarm.daysOfWeek,
          notes: alarm.notes ?? '',
        }}
        submitLabel="Guardar"
        onSubmit={async (payload) => {
          await updateAlarm({ ...alarm, ...payload })
          show('success', 'Alarma editada correctamente')
          navigate('/admin/alarmas')
        }}
      />
      <button
        type="button"
        onClick={async () => {
          await deleteAlarm(alarm.id)
          show('success', 'Alarma eliminada')
          navigate('/admin/alarmas')
        }}
        className="mx-4 mb-6 w-[calc(100%-32px)] rounded-xl bg-red-500 p-4 text-lg font-semibold text-white shadow-md"
      >
        Eliminar
      </button>
    </>
  )
}
