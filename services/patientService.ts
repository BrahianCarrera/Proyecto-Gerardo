import { apiFetch } from './api'

export async function getPatients() {
  const response =await apiFetch('/patients')
  if (!response) throw new Error("Error al obtener pacientes");
  return response;
}

export async function getPatientById(id: string) {
  const response = await apiFetch('/patients?id=' + id) // FALTA el `await`
  console.log(response)
  if (!response) throw new Error("Error al obtener al paciente");
  return response[0];
}

