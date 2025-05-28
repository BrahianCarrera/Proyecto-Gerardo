import React from 'react'
import { Stack } from 'expo-router'

export default function AlarmStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#14798B',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="add-alarm"
        options={{
          headerTitle: 'Agregar Alarma',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: 'Editar Alarma',
        }}
      ></Stack.Screen>
    </Stack>
  )
}
