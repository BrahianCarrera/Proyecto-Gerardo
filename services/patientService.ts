import { apiFetch } from './api'

export async function getPatients() {
  const response = apiFetch('/patients')
  if (!response) throw new Error("Error al obtener pacientes");
  return response;
}

