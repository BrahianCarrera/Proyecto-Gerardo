import { api} from './api'

interface Ingredient {
  name: string;
  quantity: number;
  unit: string; // Asumiendo que cada ingrediente también tiene una unidad
}

interface MealPayload {
  name: string;
  type: string;
  size: string;
  calories: number;
  protein: number;
  carbs: number;
  sugar: number;
  fat: number;
  fiber: number;
  sodium: number;
  foodGroup: string;
  ingredients: Ingredient[];
}

export async function getMeals() {
  return await api.get('/meals')
}

export async function logMeal(data: {
  patientId: string | undefined
  mealId: string
}) {
  return await api.post("/mealLogs", data)
}

export async function addMeal(payload:MealPayload){

  return await api.post("/meals",payload)
}
