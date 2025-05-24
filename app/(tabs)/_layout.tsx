import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function TabLayout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#14798B',
          headerShadowVisible: true,
          tabBarStyle: {
            paddingBottom: 10, // espacio adicional
            height: 60,
          },
          headerStyle: { backgroundColor: '#14798B' },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="patients"
          options={{
            title: 'Pacientes',
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
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="restaurant-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="alarms"
          options={{
            title: 'Alarmas',
            headerTitle: 'Alarmas ',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="alarm" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  )
}
