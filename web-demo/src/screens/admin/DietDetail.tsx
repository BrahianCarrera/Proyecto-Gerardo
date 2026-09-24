import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StackHeader from '../../components/StackHeader'
import Spinner from '../../components/Spinner'
import ConfirmModal from '../../components/ConfirmModal'
import { useToast } from '../../context/ToastContext'
import {
  deleteDiet,
  getDietById,
  getMeals,
  updateDiet,
} from '../../data/mockApi'
import type { Diet, Meal } from '../../types'

export default function DietDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { show } = useToast()
  const [diet, setDiet] = useState<Diet | null>(null)
  const [allMeals, setAllMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', observations: '' })

  useEffect(() => {
    if (!id) return
    Promise.all([getDietById(id), getMeals()])
      .then(([d, m]) => {
        setDiet(d)
        setAllMeals(m)
        if (d)
          setForm({
            name: d.name,
            description: d.description,
            observations: d.observations,
          })
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading || !diet)
    return (
      <>
        <StackHeader title="Dieta" />
        <Spinner text="Cargando dieta..." />
      </>
    )

  const handleSave = async () => {
    try {
      const updated = await updateDiet({
        dietId: diet.id,
        name: form.name,
        description: form.description,
        observations: form.observations,
      })
      setDiet(updated)
      setIsEditing(false)
      show('success', 'Dieta actualizada correctamente')
    } catch (err) {
      show('error', 'Error al guardar', (err as Error).message)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteDiet(diet.id)
      show('success', 'Dieta eliminada')
      navigate('/admin/dietas')
    } catch (err) {
      show('error', 'Error al eliminar', (err as Error).message)
    }
  }

  const inputCls =
    'w-full rounded border border-primary bg-white p-2 text-base outline-none'

  return (
    <>
      <StackHeader title="Detalle de Dieta" />
      <div className="space-y-3 p-3">
        <section className="rounded-md border border-gray-300 bg-white p-4 shadow">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-900">
            Información de la Dieta
          </h2>

          <div className="my-3">
            <span className="font-bold text-gray-900">Nombre: </span>
            {isEditing ? (
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            ) : (
              <span className="text-gray-800">{diet.name}</span>
            )}
          </div>

          <div className="my-3">
            <span className="font-bold text-gray-900">Descripción: </span>
            {isEditing ? (
              <textarea
                className={`${inputCls} mt-1 h-20`}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            ) : (
              <span className="text-gray-800">{diet.description}</span>
            )}
          </div>

          <div className="my-3">
            <span className="font-bold text-gray-900">Observaciones: </span>
            {isEditing ? (
              <textarea
                className={`${inputCls} mt-1 h-20`}
                value={form.observations}
                onChange={(e) =>
                  setForm({ ...form, observations: e.target.value })
                }
              />
            ) : (
              <span className="text-gray-800">{diet.observations}</span>
            )}
          </div>

          {diet.tags.length > 0 && (
            <div className="my-3">
              <span className="font-bold text-gray-900">Etiquetas: </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {diet.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-secondary px-2 py-1 text-xs text-black"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-md border border-gray-300 bg-white p-4 shadow">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-900">
            Comidas Asociadas
          </h2>
          <div className="flex flex-wrap gap-2">
            {diet.mealIds.length === 0 && (
              <p className="text-sm text-gray-500">
                Sin comidas asociadas todavía.
              </p>
            )}
            {diet.mealIds.map((mid) => (
              <span
                key={mid}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
              >
                {allMeals.find((m) => m.id === mid)?.name ?? mid}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate(`/admin/dietas/${diet.id}/comidas`)}
            className="mt-4 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-md"
          >
            Asociar/Modificar Comidas
          </button>
        </section>

        <section className="rounded-md border border-gray-300 bg-white p-4 shadow">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-900">
            Acciones
          </h2>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="w-32 rounded-lg bg-primary px-6 py-2 font-bold text-white"
            >
              {isEditing ? 'Guardar' : 'Editar'}
            </button>
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="w-36 rounded-lg bg-red-500 px-6 py-2 font-bold text-white"
            >
              Eliminar Dieta
            </button>
          </div>
        </section>
      </div>

      <ConfirmModal
        open={showDelete}
        title="¿Estás seguro de que quieres eliminar esta dieta?"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </>
  )
}
