import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage' // Usaremos AsyncStorage para ambos tokens
import { jwtDecode } from 'jwt-decode'
import { router } from 'expo-router'

interface DecodedToken {
  id: string
  role: string
  email: string
  exp: number
}

export type User = {
  id: string
  role: string
  name?: string
  picture?: string
  email: string
}

type UserContextType = {
  user: User | null
  loading: boolean
  accessToken: string | null
  login: (accessToken: string, refreshToken: string) => Promise<void>
  logout: () => void
  refreshAccessToken: () => Promise<boolean> // Función para refrescar el token
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  accessToken: null,
  login: async () => {},
  logout: async () => {},
  refreshAccessToken: async () => false,
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  // Función interna para decodificar y establecer el usuario
  const decodeAndSetUser = (token: string | null) => {
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token)
        setUser({
          id: decoded.id,
          role: decoded.role,
          email: decoded.email,
        })
      } catch (error) {
        console.error('Error al decodificar el access token:', error)
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }

  // Define logout antes de refreshAccessToken para que pueda ser llamada
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('accessToken')
      await AsyncStorage.removeItem('refreshToken')
      setUser(null)
      setAccessToken(null)
      router.replace('landingpage/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }, []) // No tiene dependencias externas

  // Función para refrescar el access token
  const refreshAccessToken = useCallback(async () => {
    console.log('Intentando refrescar el access token...')
    try {
      setLoading(true)
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken')

      if (!storedRefreshToken) {
        console.log('No hay refresh token almacenado. Redirigiendo a login.')
        await logout() // Llama a logout para limpiar todo
        return false
      }

      // **Aquí debes hacer la llamada a tu API para renovar el token**
      // Reemplaza 'TU_URL_API/auth/refresh-token' con tu endpoint real
      const response = await fetch('TU_URL_API/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      })

      if (!response.ok) {
        console.error(
          'Error al renovar el token:',
          response.status,
          await response.text(),
        )
        await logout() // Si falla la renovación, cierra sesión
        return false
      }

      const data = await response.json()
      const newAccessToken = data.accessToken
      const newRefreshToken = data.refreshToken || storedRefreshToken // Tu API puede retornar un nuevo refresh token o el mismo

      await AsyncStorage.setItem('accessToken', newAccessToken)
      setAccessToken(newAccessToken)
      decodeAndSetUser(newAccessToken)

      if (newRefreshToken && newRefreshToken !== storedRefreshToken) {
        await AsyncStorage.setItem('refreshToken', newRefreshToken)
      }

      console.log('Access token refrescado exitosamente.')
      return true
    } catch (error) {
      console.error('Error al refrescar el access token:', error)
      await logout()
      return false
    } finally {
      setLoading(false)
    }
  }, [logout]) // Dependencia: logout

  // Cargar tokens al iniciar la app
  useEffect(() => {
    const loadTokensFromStorage = async () => {
      try {
        const storedAccessToken = await AsyncStorage.getItem('accessToken')
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken') // Leer también el refresh token

        if (storedAccessToken) {
          const decoded: DecodedToken = jwtDecode(storedAccessToken)
          if (decoded.exp * 1000 < Date.now()) {
            console.log('Access token expirado. Intentando refrescar...')
            const refreshed = await refreshAccessToken()
            if (!refreshed) {
              console.log('Fallo al refrescar. Limpiando tokens.')
              await logout()
            }
          } else {
            setAccessToken(storedAccessToken)
            decodeAndSetUser(storedAccessToken)
          }
        } else if (storedRefreshToken) {
          // Si no hay access token pero sí refresh token, intenta refrescar
          console.log(
            'No hay access token, pero sí refresh token. Intentando refrescar...',
          )
          const refreshed = await refreshAccessToken()
          if (!refreshed) {
            console.log('Fallo al refrescar. Limpiando tokens.')
            await logout()
          }
        } else {
          console.log('No hay tokens almacenados.')
          setUser(null)
          setAccessToken(null)
        }
      } catch (error) {
        console.error('Error al cargar tokens desde AsyncStorage:', error)
        await logout() // En caso de error, limpia todo
      } finally {
        setLoading(false)
      }
    }

    loadTokensFromStorage()
  }, [refreshAccessToken, logout]) // Dependencias: refreshAccessToken y logout

  const login = async (newAccessToken: string, newRefreshToken: string) => {
    try {
      setLoading(true)
      await AsyncStorage.setItem('accessToken', newAccessToken)
      await AsyncStorage.setItem('refreshToken', newRefreshToken)
      setAccessToken(newAccessToken)
      decodeAndSetUser(newAccessToken)
    } catch (error) {
      console.error('Error en el login al guardar tokens:', error)
      await logout()
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserContext.Provider
      value={{ user, loading, accessToken, login, logout, refreshAccessToken }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
