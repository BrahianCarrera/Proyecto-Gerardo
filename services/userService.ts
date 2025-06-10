import { api } from './api'



export async function registerUser(userPayload:any) {
  return await api.post("/users/register", userPayload )
  
}


export async function getUserInfo(userId: string){
  return await api.get("/users/"+userId)
}