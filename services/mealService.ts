import { apiFetch } from './api'

export async function getMeals() {
  return apiFetch('/meals')
}

export async function logMeal(data: {
  patientId: string
  mealId: string
  date?: string
}) {
  return apiFetch('/meal-logs', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}