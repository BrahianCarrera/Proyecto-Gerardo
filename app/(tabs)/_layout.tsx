import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function TabLayout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#14798B',
          tabBarStyle: {
            paddingBottom: 10, // espacio adicional
            height: 60,
          },
        }}
      >
        <Tabs.Screen
          name="patients"
          options={{
            title: 'Pacientes',
            headerStyle: { backgroundColor: '#14798B' },
            headerTintColor: 'white',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="foodtracking"
          options={{
            title: 'Comidas',
            headerTitle: 'Seguimiento de comidas',
            headerStyle: { backgroundColor: '#14798B' },
            headerTintColor: 'white',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="restaurant-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="alarms"
          options={{
            title: 'Alarmas',
            headerTitle: 'Alarmas para pacientes',
            headerStyle: { backgroundColor: '#14798B' },
            headerTintColor: 'white',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="alarm" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  )
}
