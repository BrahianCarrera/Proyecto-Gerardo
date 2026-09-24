import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Apple } from 'lucide-react'
import StackHeader from '../../components/StackHeader'
import { useToast } from '../../context/ToastContext'
import { addMeal } from '../../data/mockApi'
import {
  FOOD_GROUPS,
  MEAL_SIZES,
  MEAL_TYPES,
  pretty,
} from '../../utils/images'
import type { Ingredient, Meal } from '../../types'

const inputCls =
  'w-full rounded border border-gray-300 bg-white p-2 text-base shadow-sm outline-none focus:border-primary'
const labelCls = 'text-base text-gray-800'

export default function AddMeal() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: 'DESAYUNO',
    size: 'MEDIANA',
    foodGroup: 'CARBOHIDRATOS',
    calories: '',
    protein: '',
    carbs: '',
    sugar: '',
    fat: '',
    fiber: '',
    sodium: '',
  })
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', quantity: 0, unit: '' },
  ])
  const [error, setError] = useState('')

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value })

  const setIngredient = (i: number, patch: Partial<Ingredient>) => {
    setIngredients(ingredients.map((ing, idx) => (idx === i ? { ...ing, ...patch } : ing)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('El nombre del plato es obligatorio')
    if (!form.calories) return setError('Ingresa las calorías')

    const payload: Meal = {
      id: '',
      name: form.name.trim(),
      type: form.type,
      size: form.size,
      calories: Number(form.calories) || 0,
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      sugar: Number(form.sugar) || 0,
      fat: Number(form.fat) || 0,
      fiber: Number(form.fiber) || 0,
      sodium: Number(form.sodium) || 0,
      foodGroup: form.foodGroup,
      tags: [],
      ingredients: ingredients.filter((i) => i.name.trim()),
    }

    setSubmitting(true)
    try {
      await addMeal(payload)
      show('success', 'Comida guardada correctamente')
      navigate('/admin/comidas')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <StackHeader title="Añadir una comida" />
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div className="rounded-md border border-gray-300 bg-background p-5 shadow">
          <div className="mb-4 flex items-center gap-2">
            <Apple size={26} className="text-[#e64635]" />
            <h2 className="text-lg font-bold text-gray-900">
              Crear Nueva Comida
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className={labelCls}>Nombre del Plato</label>
              <input
                className={`${inputCls} mt-1`}
                placeholder="Ej. Sopa Ligera"
                value={form.name}
                onChange={set('name')}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Tipo de Comida</label>
                <select className={`${inputCls} mt-1`} value={form.type} onChange={set('type')}>
                  {MEAL_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {pretty(t)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Tamaño</label>
                <select className={`${inputCls} mt-1`} value={form.size} onChange={set('size')}>
                  {MEAL_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {pretty(s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Grupo Alimenticio</label>
              <select
                className={`${inputCls} mt-1`}
                value={form.foodGroup}
                onChange={set('foodGroup')}
              >
                {FOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {pretty(g)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Calorías (kcal)</label>
                <input
                  className={`${inputCls} mt-1`}
                  inputMode="decimal"
                  value={form.calories}
                  onChange={set('calories')}
                />
              </div>
              <div>
                <label className={labelCls}>Proteína (g)</label>
                <input
                  className={`${inputCls} mt-1`}
                  inputMode="decimal"
                  value={form.protein}
                  onChange={set('protein')}
                />
              </div>
              <div>
                <label className={labelCls}>Carbohidratos (g)</label>
                <input
                  className={`${inputCls} mt-1`}
                  inputMode="decimal"
                  value={form.carbs}
                  onChange={set('carbs')}
                />
              </div>
              <div>
                <label className={labelCls}>Azúcar (g)</label>
                <input
                  className={`${inputCls} mt-1`}
                  inputMode="decimal"
                  value={form.sugar}
                  onChange={set('sugar')}
                />
              </div>
              <div>
                <label className={labelCls}>Grasa (g)</label>
                <input
                  className={`${inputCls} mt-1`}
                  inputMode="decimal"
                  value={form.fat}
                  onChange={set('fat')}
                />
              </div>
              <div>
                <label className={labelCls}>Fibra (g)</label>
                <input
                  className={`${inputCls} mt-1`}
                  inputMode="decimal"
                  value={form.fiber}
                  onChange={set('fiber')}
                />
              </div>
              <div>
                <label className={labelCls}>Sodio (mg)</label>
                <input
                  className={`${inputCls} mt-1`}
                  inputMode="decimal"
                  value={form.sodium}
                  onChange={set('sodium')}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Ingredientes</label>
              <div className="mt-2 space-y-3">
                {ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-200 bg-white p-3"
                  >
                    <input
                      className={inputCls}
                      placeholder="Nombre"
                      value={ing.name}
                      onChange={(e) => setIngredient(i, { name: e.target.value })}
                    />
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <input
                        className={inputCls}
                        placeholder="Cantidad"
                        inputMode="decimal"
                        value={ing.quantity || ''}
                        onChange={(e) =>
                          setIngredient(i, { quantity: Number(e.target.value) })
                        }
                      />
                      <input
                        className={inputCls}
                        placeholder="Unidad (ej. g, ml, rebanada)"
                        value={ing.unit}
                        onChange={(e) => setIngredient(i, { unit: e.target.value })}
                      />
                    </div>
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setIngredients(ingredients.filter((_, idx) => idx !== i))
                        }
                        className="mt-2 text-sm font-medium text-red-500"
                      >
                        Remover Ingrediente
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setIngredients([
                    ...ingredients,
                    { name: '', quantity: 0, unit: '' },
                  ])
                }
                className="mt-2 text-sm font-semibold text-primary"
              >
                + Añadir Ingrediente
              </button>
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
              {submitting ? 'Guardando...' : 'Guardar Comida'}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
