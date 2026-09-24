import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ClipboardCopy } from 'lucide-react'
import StackHeader from '../../components/StackHeader'
import Spinner from '../../components/Spinner'
import ConfirmModal from '../../components/ConfirmModal'
import { useToast } from '../../context/ToastContext'
import {
  assignDietToPatient,
  getDiets,
  getPatientById,
  updatePatient,
} from '../../data/mockApi'
import type { Diet, Patient } from '../../types'

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>()
  const { show } = useToast()
  const [loading, setLoading] = useState(true)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [diets, setDiets] = useState<Diet[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isAssigningDiet, setIsAssigningDiet] = useState(false)
  const [selectedDiet, setSelectedDiet] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [form, setForm] = useState({
    name: '',
    age: '',
    medicalHistory: '',
    eatingHabits: '',
  })

  useEffect(() => {
    if (!id) return
    Promise.all([getPatientById(id), getDiets()])
      .then(([p, d]) => {
        setPatient(p)
        setDiets(d)
        if (p)
          setForm({
            name: p.name,
            age: String(p.age),
            medicalHistory: p.medicalHistory,
            eatingHabits: p.eatingHabits,
          })
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading || !patient)
    return (
      <>
        <StackHeader title="Editar usuario" />
        <Spinner text="Cargando paciente..." color="#4F46E5" />
      </>
    )

  const diet = diets.find((d) => d.id === patient.dietId)

  const handleSave = async () => {
    try {
      const updated = await updatePatient({
        patientId: patient.id,
        name: form.name,
        age: Number(form.age),
        medicalHistory: form.medicalHistory,
        eatingHabits: form.eatingHabits,
      })
      setPatient(updated)
      setIsEditing(false)
      show('success', 'Paciente actualizado correctamente')
    } catch (err) {
      show('error', 'Error al guardar', (err as Error).message)
    }
  }

  const handleAssignDiet = async () => {
    if (!selectedDiet) {
      show('error', 'Selecciona una dieta')
      return
    }
    try {
      const updated = await assignDietToPatient(patient.id, selectedDiet)
      setPatient(updated)
      setIsAssigningDiet(false)
      show('success', 'Dieta asignada correctamente')
    } catch (err) {
      show('error', 'Error al asignar dieta', (err as Error).message)
    }
  }

  const handleDeleteDiet = async () => {
    try {
      const updated = await assignDietToPatient(patient.id, null)
      setPatient(updated)
      setShowDeleteModal(false)
      show('success', 'Dieta eliminada del paciente')
    } catch (err) {
      show('error', 'Error al eliminar la dieta', (err as Error).message)
    }
  }

  const row = 'flex items-start gap-2 my-4'
  const label = 'w-2/5 shrink-0 text-base font-bold text-gray-900'
  const value = 'flex-1 min-w-0 break-words text-base text-gray-800'
  const editInput =
    'w-full rounded border border-primary bg-white p-2 text-base outline-none'

  return (
    <>
      <StackHeader title="Editar usuario" />
      <div className="space-y-3 p-3">
        {/* Información General */}
        <section className="mb-2 rounded-md border border-gray-200 bg-white p-4 shadow">
          <h2 className="mb-6 text-center text-xl font-bold text-gray-900">
            Información General
          </h2>

          <div className={row}>
            <span className={label}>Documento:</span>
            <div className="flex flex-1 items-center gap-3">
              <span className={value}>{patient.id}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(patient.id)
                  show('success', 'Documento copiado al portapapeles')
                }}
                className="shrink-0"
                title="Copiar"
              >
                <ClipboardCopy size={26} className="text-primary" />
              </button>
            </div>
          </div>

          <div className={row}>
            <span className={label}>Nombre:</span>
            <div className="flex-1">
              {isEditing ? (
                <input
                  className={editInput}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              ) : (
                <span className={value}>{patient.name}</span>
              )}
            </div>
          </div>

          <div className={row}>
            <span className={label}>Edad:</span>
            <div className="flex-1">
              {isEditing ? (
                <input
                  className={editInput}
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  inputMode="numeric"
                />
              ) : (
                <span className={value}>{patient.age} años</span>
              )}
            </div>
          </div>

          <div className={row}>
            <span className={label}>Diagnóstico:</span>
            <div className="flex-1">
              {isEditing ? (
                <textarea
                  className={`${editInput} h-24`}
                  value={form.medicalHistory}
                  onChange={(e) =>
                    setForm({ ...form, medicalHistory: e.target.value })
                  }
                />
              ) : (
                <span className={value}>{patient.medicalHistory}</span>
              )}
            </div>
          </div>

          <div className={row}>
            <span className={label}>Hábitos alimenticios:</span>
            <div className="flex-1">
              {isEditing ? (
                <textarea
                  className={`${editInput} h-24`}
                  value={form.eatingHabits}
                  onChange={(e) =>
                    setForm({ ...form, eatingHabits: e.target.value })
                  }
                />
              ) : (
                <span className={value}>{patient.eatingHabits}</span>
              )}
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="rounded-lg bg-primary px-6 py-2 text-base font-bold text-white"
            >
              {isEditing ? 'Guardar' : 'Editar'}
            </button>
          </div>
        </section>

        {/* Dietas Asignadas */}
        <section className="rounded-md border border-gray-300 bg-white p-4 shadow">
          <h2 className="mb-6 text-center text-xl font-bold text-gray-900">
            Dietas Asignadas
          </h2>

          {isAssigningDiet && (
            <select
              className="mb-4 w-full rounded-md border border-gray-300 bg-white p-2.5"
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value)}
            >
              <option value="" disabled>
                Selecciona un tipo...
              </option>
              {diets.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          )}

          <p className="mb-3 text-base font-bold text-gray-900">
            {diet?.name ?? 'Sin dieta asignada'}
          </p>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                isAssigningDiet ? handleAssignDiet() : setIsAssigningDiet(true)
              }
              className="w-32 rounded-lg bg-primary px-6 py-2 text-base font-bold text-white"
            >
              {isAssigningDiet ? 'Guardar' : 'Asignar'}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="w-32 rounded-lg bg-red-500 px-6 py-2 text-base font-bold text-white"
            >
              Eliminar
            </button>
          </div>
        </section>
      </div>

      <ConfirmModal
        open={showDeleteModal}
        title="¿Estás seguro de que quieres eliminar esta dieta?"
        onConfirm={handleDeleteDiet}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  )
}
