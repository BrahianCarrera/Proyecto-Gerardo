import React from 'react'
import { Stack } from 'expo-router'

export default function AddMealsLayout() {
  return (
    <Stack
      screenOptions={{
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
        name="addMeals"
        options={{
          headerTitle: 'Añadir una comida',
        }}
      />
    </Stack>
  )
}
