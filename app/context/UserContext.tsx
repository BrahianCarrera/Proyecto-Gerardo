import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'

export type User = {
  id: string
  name: string
  role: 'ESPECIALISTA' | 'user'
  dietId: string
  image: null
  email: string
}

type UserContextType = {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        if (token) {
          const decoded = jwtDecode<User>(token)
          setUser(decoded)
        }
      } catch (error) {
        console.log('Error al cargar el usuario:', error)
      }
    }

    loadUser()
  }, [])

  const logout = async () => {
    await AsyncStorage.removeItem('token')
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
