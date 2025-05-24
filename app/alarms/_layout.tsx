import { Stack } from 'expo-router'

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Agregar Alarma',
        headerStyle: {
          backgroundColor: '#14798B',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="Agregar Alarma" options={{}} />
    </Stack>
  )
}
