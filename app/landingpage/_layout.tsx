import React from 'react'
import { Stack } from 'expo-router'

export default function PatientsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerTitle: 'Iniciar sesion',
        }}
      />

      <Stack.Screen
        name="add-patient"
        options={{
          headerTitle: 'Registrate',
        }}
      />
    </Stack>
  )
}
