import { useEffect, useState } from 'react'
import { HelpCircle, X } from 'lucide-react'
import Header from '../../components/Header'
import MealCard from '../../components/MealCard'
import Spinner from '../../components/Spinner'
import ConfirmModal from '../../components/ConfirmModal'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import {
  getCaregiverPatients,
  getDietsByPatientId,
  getMeals,
  isMealConsumedToday,
  logMeal,
} from '../../data/mockApi'
import { MEAL_TYPE_IMAGES } from '../../utils/images'
import type { Meal, Patient } from '../../types'

const MEAL_ORDER = ['desayuno', 'almuerzo', 'merienda', 'cena', 'mediatarde']

const MEAL_TYPE_CLASSES: Record<string, string> = {
  desayuno: 'bg-yellow-100',
  almuerzo: 'bg-green-100',
  cena: 'bg-indigo-100',
  merienda: 'bg-pink-100',
  mediatarde: 'bg-orange-100',
  snack: 'bg-blue-100',
}

interface ConsumableMeal extends Meal {
  isConsumed: boolean
}

export default function UserFoodTracking() {
  const { user } = useAuth()
  const { show } = useToast()
  const [meals, setMeals] = useState<ConsumableMeal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [patients, setPatients] = useState<Pick<Patient, 'id' | 'name'>[]>([])
  const [caregiverPatientId, setCaregiverPatientId] = useState('')
  const [displayPatientId, setDisplayPatientId] = useState<string | null>(null)
  const [showSizes, setShowSizes] = useState(false)
  const [confirmMeal, setConfirmMeal] = useState<ConsumableMeal | null>(null)

  const loadDiet = async (patientId: string) => {
    setLoading(true)
    setError(null)
    setMeals([])
    try {
      const diets = await getDietsByPatientId(patientId)
      if (diets.length === 0) {
        setError('No se encontraron dietas para este paciente.')
        setDisplayPatientId(null)
        return
      }
      const dietMeals = diets[0].mealIds
      const catalog = await getMeals()
      const consumedFlags = await Promise.all(
        dietMeals.map((mid) => isMealConsumedToday(patientId, mid)),
      )
      const loaded: ConsumableMeal[] = dietMeals
        .map((mid, i) => {
          const m = catalog.find((x) => x.id === mid)
          if (!m) return null
          return { ...m, isConsumed: consumedFlags[i] ?? false }
        })
        .filter(Boolean) as ConsumableMeal[]

      setMeals(loaded)
      setDisplayPatientId(patientId)
    } catch {
      setError('Error al cargar la información de la dieta.')
      setDisplayPatientId(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    if (user.role === 'PACIENTE') {
      loadDiet(user.id)
    } else if (user.role === 'CUIDADOR') {
      getCaregiverPatients(user.id)
        .then(setPatients)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.role])

  const grouped = (() => {
    const map: Record<string, ConsumableMeal[]> = {}
    meals.forEach((m) => {
      const t = m.type.toLowerCase()
      ;(map[t] ||= []).push(m)
    })
    const ordered: Record<string, ConsumableMeal[]> = {}
    MEAL_ORDER.forEach((t) => {
      if (map[t]) ordered[t] = map[t]
    })
    Object.keys(map).forEach((t) => {
      if (!ordered[t]) ordered[t] = map[t]
    })
    return ordered
  })()

  const canRegister =
    user?.role === 'PACIENTE' || (user?.role === 'CUIDADOR' && displayPatientId)

  const requestToggle = (meal: ConsumableMeal) => {
    if (!canRegister) {
      show(
        'info',
        'Selecciona un paciente para registrar el consumo.',
      )
      return
    }
    setConfirmMeal(meal)
  }

  const applyToggle = async () => {
    if (!confirmMeal) return
    const meal = confirmMeal
    const wasConsumed = meal.isConsumed
    setConfirmMeal(null)

    // optimistic
    const updated = meals.map((m) =>
      m.id === meal.id ? { ...m, isConsumed: !wasConsumed } : m,
    )
    setMeals(updated)

    try {
      const idToLog = user?.role === 'PACIENTE' ? user!.id : displayPatientId
      if (!idToLog) throw new Error('No hay ID de paciente')
      await logMeal({ patientId: idToLog, mealId: meal.id })
      show('success', 'Estado de comida actualizado')
    } catch (err) {
      setMeals(
        meals.map((m) =>
          m.id === meal.id ? { ...m, isConsumed: wasConsumed } : m,
        ),
      )
      show('error', 'Error al actualizar estado', (err as Error).message)
    }
  }

  if (loading && user?.role === 'PACIENTE')
    return (
      <>
        <Header />
        <Spinner text="Cargando tus comidas..." />
      </>
    )

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1">
        {user?.role === 'CUIDADOR' && (
          <div className="border-b border-gray-200 bg-gray-100 p-4">
            <p className="mb-2 text-lg font-bold">Ver Dieta de Paciente</p>
            <select
              className="w-full rounded-xl border border-gray-300 bg-white p-3"
              value={caregiverPatientId}
              onChange={(e) => {
                const v = e.target.value
                setCaregiverPatientId(v)
                if (v) loadDiet(v)
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
                Mostrando dieta para: {displayPatientId}
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

        {loading && user?.role === 'CUIDADOR' && (
          <Spinner text="Cargando dieta para el paciente..." />
        )}

        {!loading && error && (
          <div className="flex h-40 items-center justify-center p-4">
            <p className="text-center text-lg text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && meals.length > 0 && (
          <>
            <div className="flex items-center justify-end gap-2 px-4 py-2">
              <button
                type="button"
                onClick={() => setShowSizes(true)}
                className="flex items-center gap-1"
              >
                <span className="text-base underline">
                  Más información sobre los tamaños
                </span>
                <HelpCircle size={26} className="text-primary" />
              </button>
            </div>

            <div className="px-2 pb-4">
              {Object.entries(grouped).map(([type, mealsOfType]) => (
                <div key={type} className="mb-4">
                  <div
                    className={`rounded-xl ${
                      MEAL_TYPE_CLASSES[type] ?? 'bg-gray-100'
                    }`}
                  >
                    <p className="px-2 py-2 text-xl font-bold capitalize text-gray-800">
                      {type}
                    </p>
                  </div>
                  {mealsOfType.map((meal) => (
                    <MealCard
                      key={meal.id}
                      id={meal.id}
                      title={meal.name}
                      description={String(meal.calories)}
                      imageUrl={
                        MEAL_TYPE_IMAGES[meal.type.toLowerCase()] ?? ''
                      }
                      isConsumed={meal.isConsumed}
                      size={
                        meal.size.charAt(0).toUpperCase() +
                        meal.size.slice(1).toLowerCase()
                      }
                      onPressCard={() => requestToggle(meal)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {!loading &&
          !error &&
          meals.length === 0 &&
          user?.role === 'PACIENTE' && (
            <div className="flex h-40 items-center justify-center p-4">
              <p className="text-center text-lg text-gray-600">
                No hay comidas para mostrar en tu dieta.
              </p>
            </div>
          )}
        {!loading &&
          !error &&
          meals.length === 0 &&
          user?.role === 'CUIDADOR' &&
          !displayPatientId && (
            <div className="flex h-40 items-center justify-center p-4">
              <p className="text-center text-lg text-gray-600">
                Seleccione un paciente para ver su dieta.
              </p>
            </div>
          )}
      </div>

      <ConfirmModal
        open={confirmMeal !== null}
        danger={false}
        title={
          confirmMeal?.isConsumed
            ? `¿Desmarcar "${confirmMeal?.name}" como no consumida?`
            : `¿Estás seguro de que quieres marcar "${confirmMeal?.name}" como consumida?`
        }
        confirmLabel={confirmMeal?.isConsumed ? 'Sí, desmarcar' : 'Confirmar'}
        cancelLabel="Cancelar"
        onConfirm={applyToggle}
        onCancel={() => setConfirmMeal(null)}
      />

      {showSizes && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
          <div className="relative flex h-[80%] w-full flex-col items-center rounded-2xl bg-white p-5">
            <button
              type="button"
              onClick={() => setShowSizes(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1"
              aria-label="Cerrar"
            >
              <X size={24} className="text-gray-700" />
            </button>
            <img
              src="./assets/sizes.png"
              alt="Guía de tamaños de porción"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
