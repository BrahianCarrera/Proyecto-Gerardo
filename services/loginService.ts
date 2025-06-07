
import {api} from 'services/api'

export async function login(loginRequest: any) {
    return await api.post("/auth/login",loginRequest)
}