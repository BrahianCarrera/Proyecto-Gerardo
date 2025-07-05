import { api } from './api'

export async function deleteDiet(id: string) {
  return await api.delete(`/diets/${id}` )
}

export async function getDiets() {
  return await api.get("/diets")
  
}

export async function createDiet(payload: { name: string; description: string; notes: string }){
  return await api.post("/diets", payload )
}

export async function assignMealsToDiet(payload: {dietId: string, mealIds : String[]} ){
  return await api.put("/meals/assign" , payload)
}

export async function getDietByPatientId(userId: string){
  return await api.get(`/diets?patientId=${userId}`)
}

export async function updateDiet(payload:any){
  return await api.put("/diets", payload)
}

export async function getDietById(dietId:string) {
  const res =  await api.get(`/diets?id=${dietId}`)
  return res[0]
}

export async function getMealsByDietId(dietId:string) {
  const res =  await api.get(`/diets?id=${dietId}`)
  return res[0].meals
}

