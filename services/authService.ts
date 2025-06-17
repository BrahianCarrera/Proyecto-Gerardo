import { api } from './api'

export async function verifyCode(codePayload: {
    email:string 
    otp: string,
}){
    return api.post("/users/verify-specialist", codePayload)
}