import React from 'react'
import { Stack } from 'expo-router'

export default function DietsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Agregar Alarma',
        headerStyle: {
          backgroundColor: '#14798B',
        },
        headerTitleAlign: 'center',
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: 'Editar Dieta ',
        }}
      />

      <Stack.Screen
        name="add-Diet"
        options={{
          headerTitle: 'Ingresar Paciente',
        }}
      />
    </Stack>
  )
}
