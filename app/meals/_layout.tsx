import { UserProvider } from './../context/UserContext'
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

export default function MealsLayout() {
  return (
    <>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: true }} />

        <Stack.Screen
          name="addMeals"
          options={{
            headerTitle: 'Añadir comida',
          }}
        />
      </SafeAreaProvider>
    </>
  )
}
