import React from 'react'
import { Stack } from 'expo-router'

export default function AlarmStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Agregar Alarma',
        animation: 'slide_from_bottom',
        animationDuration: 400,
        animationTypeForReplace: 'push',
        headerStyle: {
          backgroundColor: '#14798B',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="add-alarm" options={{}} />
    </Stack>
  )
}
