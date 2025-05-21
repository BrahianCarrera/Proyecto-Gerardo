import { api } from './api'

export async function deleteDiet(id: string) {
  return await api.delete('/')
}

export async function getDiets() {
  return await api.get("/diets")
  
}