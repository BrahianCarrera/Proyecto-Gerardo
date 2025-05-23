import {api} from 'services/api'

export async function getAlarmsByPatient(id: string) {
  
 const res =  await api.get(`/alarms/search/?search=${id}`);
    console.log(res)
 return res; 
}

export async function createAlarm(payload:any) {
    return await api.post('/alarms', payload); 
}