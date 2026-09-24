import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import StackHeader from '../../components/StackHeader'
import Spinner from '../../components/Spinner'
import FilterChips from '../../components/FilterChips'
import { useToast } from '../../context/ToastContext'
import {
  assignMealsToDiet,
  getDietById,
  getMeals,
} from '../../data/mockApi'
import { FOOD_GROUPS, MEAL_SIZES, MEAL_TYPES, pretty } from '../../utils/images'
import type { Meal } from '../../types'

export default function AssociateMeals() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { show } = useToast()
  const [loading, setLoading] = useState(true)
  const [meals, setMeals] = useState<Meal[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [typeFilters, setTypeFilters] = useState<string[]>([])
  const [sizeFilters, setSizeFilters] = useState<string[]>([])
  const [groupFilters, setGroupFilters] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([getMeals(), getDietById(id)])
      .then(([m, d]) => {
        setMeals(m)
        setSelected(d?.mealIds ?? [])
      })
      .finally(() => setLoading(false))
  }, [id])

  const filtered = useMemo(
    () =>
      meals.filter(
        (m) =>
          (typeFilters.length === 0 || typeFilters.includes(m.type)) &&
          (sizeFilters.length === 0 || sizeFilters.includes(m.size)) &&
          (groupFilters.length === 0 || groupFilters.includes(m.foodGroup)),
      ),
    [meals, typeFilters, sizeFilters, groupFilters],
  )

  const toggle = (mealId: string) =>
    setSelected((s) =>
      s.includes(mealId) ? s.filter((x) => x !== mealId) : [...s, mealId],
    )

  const toggleIn = (
    list: string[],
    setList: (v: string[]) => void,
    v: string,
  ) =>
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  const handleSubmit = async () => {
    if (!id) return
    setSubmitting(true)
    try {
      await assignMealsToDiet(id, selected)
      show('success', 'Comidas asociadas correctamente')
      navigate(`/admin/dietas/${id}`)
    } catch (err) {
      show('error', 'Error al asociar', (err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading)
    return (
      <>
        <StackHeader title="Editar Dieta" />
        <Spinner text="Cargando comidas..." />
      </>
    )

  return (
    <>
      <StackHeader title="Editar Dieta" />
      <div className="p-4">
        <h2 className="mb-3 text-lg font-bold text-gray-900">
          Selecciona comidas para asociar
        </h2>

        <div className="mb-4 space-y-3 rounded-xl border border-gray-200 bg-white p-3">
          <p className="text-sm font-semibold text-gray-700">Filtrar comidas</p>
          <div>
            <p className="mb-1 text-xs text-gray-500">Por tipo</p>
            <FilterChips
              options={[...MEAL_TYPES]}
              active={typeFilters}
              onToggle={(v) => toggleIn(typeFilters, setTypeFilters, v)}
              formatter={pretty}
            />
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-500">Por tamaño</p>
            <FilterChips
              options={[...MEAL_SIZES]}
              active={sizeFilters}
              onToggle={(v) => toggleIn(sizeFilters, setSizeFilters, v)}
              formatter={pretty}
            />
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-500">Por grupo alimenticio</p>
            <FilterChips
              options={[...FOOD_GROUPS]}
              active={groupFilters}
              onToggle={(v) => toggleIn(groupFilters, setGroupFilters, v)}
              formatter={pretty}
            />
          </div>
        </div>

        <div className="space-y-2 pb-4">
          {filtered.map((meal) => {
            const checked = selected.includes(meal.id)
            return (
              <button
                key={meal.id}
                type="button"
                onClick={() => toggle(meal.id)}
                className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition ${
                  checked
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    checked
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-400 bg-white'
                  }`}
                >
                  {checked && <Check size={14} strokeWidth={3} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {meal.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {pretty(meal.type)} · {pretty(meal.size)} ·{' '}
                    {pretty(meal.foodGroup)}
                  </p>
                  {meal.tags && meal.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {meal.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-1 truncate text-[11px] text-gray-400">
                    {meal.ingredients.map((i) => i.name).join(', ')}
                  </p>
                </div>
              </button>
            )
          })}
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-gray-500">
              No hay comidas que coincidan con los filtros.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full rounded-xl bg-primary p-4 text-lg font-semibold text-white shadow-md disabled:opacity-70"
        >
          {submitting
            ? 'Asociando...'
            : `Asociar comidas seleccionadas (${selected.length})`}
        </button>
      </div>
    </>
  )
}
