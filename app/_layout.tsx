import { UserProvider, useUser } from './context/UserContext'
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { useEffect } from 'react' // Importar useEffect
import { initRequestService } from 'services/requestService' // Importar initRequestService

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
  }, [accessToken, refreshAccessToken, logout]) // Dependencias para re-inicializar si cambian

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </>
  )
}

// Envuelve tu RootLayoutContent con el UserProvider
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <RootLayoutContent />
      </UserProvider>
    </SafeAreaProvider>
  )
}
