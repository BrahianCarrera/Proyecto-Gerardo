import { api } from './api'

export async function verifyCode(codePayload: {
    email:string | undefined,
    opt: string,
}){
    return api.post("/auth/login", codePayload)
}