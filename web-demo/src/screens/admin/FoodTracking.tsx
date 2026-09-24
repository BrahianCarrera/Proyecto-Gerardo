import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MealCard from '../../components/MealCard'
import { getMeals } from '../../data/mockApi'
import { MEAL_TYPE_IMAGES } from '../../utils/images'
import type { Meal } from '../../types'

export default function AdminFoodTracking() {
  const [meals, setMeals] = useState<Meal[]>([])
  const navigate = useNavigate()

  const fetchMeals = useCallback(async () => {
    setMeals(await getMeals())
  }, [])

  useEffect(() => {
    fetchMeals()
  }, [fetchMeals])

  return (
    <div className="pb-4">
      <div className="px-2">
        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            id={meal.id}
            title={meal.name}
            description={
              meal.type.charAt(0).toUpperCase() +
              meal.type.slice(1).toLowerCase()
            }
            size={meal.size.charAt(0).toUpperCase() + meal.size.slice(1).toLowerCase()}
            isConsumed={false}
            imageUrl={MEAL_TYPE_IMAGES[meal.type.toLowerCase()] ?? ''}
            onPressCard={() => undefined}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => navigate('/admin/comidas/nueva')}
        className="mx-4 my-4 block w-[calc(100%-32px)] rounded-md bg-primary p-4 text-center text-lg text-white"
      >
        Agregar Comida
      </button>
    </div>
  )
}
