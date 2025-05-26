import {api} from 'services/api'

export async function getAlarmsByPatient(id: string) {
  
 const res =  await api.get(`/alarms/search/?search=${id}`);
 return res; 
}

export async function createAlarm(payload:any) {
    return await api.post('/alarms', payload); 
}

export async function updateAlarm( payload: any){
    return await api.put('/alarms',payload );
}

export const getAlarmById = async (id: string) => {
  const response = await api.get(`/alarms?id=${id}`);
  return response
}