import { api } from './api'



export async function registerUser(userPayload:any) {
  return await api.post("/users/register", userPayload )
  
}