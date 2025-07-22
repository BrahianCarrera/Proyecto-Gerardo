import { UserProvider, useUser } from './context/UserContext'
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { useEffect } from 'react'
import { initRequestService } from 'services/requestService'
import { StatusBar } from 'react-native' // <-- Importa StatusBar aquí

// Componente que contendrá la lógica y las pantallas de navegación
function RootLayoutContent() {
  const { accessToken, refreshAccessToken, logout } = useUser()

  useEffect(() => {
    // Inicializa el requestService con las funciones del UserContext
    // Esto asegura que el servicio tenga acceso a la lógica de autenticación
    initRequestService(
      async () => accessToken, // getAccessToken
      refreshAccessToken, // refreshAccessTokenFn
      logout, // onSessionExpired
    )
  }, [accessToken, refreshAccessToken, logout])

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </>
  )
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <RootLayoutContent />
      </UserProvider>
    </SafeAreaProvider>
  )
}
