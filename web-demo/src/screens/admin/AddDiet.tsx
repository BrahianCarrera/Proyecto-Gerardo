import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StackHeader from '../../components/StackHeader'
import { useToast } from '../../context/ToastContext'
import { createDiet } from '../../data/mockApi'

const inputCls =
  'w-full rounded-md border border-gray-300 bg-white p-2.5 text-base shadow-sm outline-none focus:border-primary'

export default function AddDiet() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('El nombre de la dieta es obligatorio')
    setSubmitting(true)
    try {
      const diet = await createDiet({ name: name.trim(), description, notes })
      show('success', 'Dieta creada', 'Ahora asocia sus comidas')
      navigate(`/admin/dietas/${diet.id}/comidas`)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <StackHeader title="Añadir Dieta" />
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div className="rounded-md border border-gray-300 bg-white p-5 shadow">
          <div className="space-y-3">
            <div>
              <label className="text-base text-gray-800">
                Nombre de la dieta
              </label>
              <input
                className={`${inputCls} mt-1`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Dieta para Hipertensión"
              />
            </div>
            <div>
              <label className="text-base text-gray-800">Descripción</label>
              <textarea
                className={`${inputCls} mt-1 h-24`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el objetivo del plan alimenticio..."
              />
            </div>
            <div>
              <label className="text-base text-gray-800">Notas</label>
              <textarea
                className={`${inputCls} mt-1 h-20`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observaciones adicionales..."
              />
            </div>

            {error && (
              <p className="text-center text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-primary p-4 text-lg font-semibold text-white shadow-md disabled:opacity-70"
            >
              {submitting
                ? 'Creando...'
                : 'Agregar Dieta y Asociar Comidas'}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
