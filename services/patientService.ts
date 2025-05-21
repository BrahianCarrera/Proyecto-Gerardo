import { api } from './api'

export async function getPatients() {
  return await api.get('/patients')
}

export async function getPatientById(id: string) {
  const res = await api.get(`/patients?id=${id}`)
  console.log(res[0])
  return res[0]
}

export async function updatePatient( data: any) {
  console.log(data)
  return await api.put(`/patients`, data)
}

export async function assignDietToPatientData(data:any) {
  return await api.put('/patients/assign',data)
  
}
