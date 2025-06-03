import { UserProvider } from './context/UserContext'
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

export default function RootLayout() {
  return (
    <>
      <SafeAreaProvider>
        <UserProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <Toast />
        </UserProvider>
      </SafeAreaProvider>
    </>
  )
}
