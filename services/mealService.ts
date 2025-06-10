import { api} from './api'

export async function getMeals() {
  return await api.get('/meals')
}

export async function logMeal(data: {
  patientId: string | undefined
  mealId: string
}) {
  return await api.post("/mealLogs", data)
}
