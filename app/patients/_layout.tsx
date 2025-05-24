import { Stack } from 'expo-router'

export default function PatientsStackLayout() {
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
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: 'Editar usuario',
        }}
      />

      <Stack.Screen
        name="add-patient"
        options={{
          headerTitle: 'Ingresar Paciente',
        }}
      />
    </Stack>
  )
}
