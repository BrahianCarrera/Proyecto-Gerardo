import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'

export const saveToken = async (token: string) => {
  await AsyncStorage.setItem('token', token)
}

export const getUserFromToken = async () => {
  const token = await AsyncStorage.getItem('token')
  if (!token) return null

  const decoded = jwtDecode(token)
  return decoded
}