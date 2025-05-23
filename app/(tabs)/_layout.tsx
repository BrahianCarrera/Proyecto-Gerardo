import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline'

          switch (route.name) {
            case 'patients':
              iconName = 'person-outline'
              break
            case 'foodTracking':
              iconName = 'restaurant-outline'
              break
            case 'alarms':
              iconName = 'alarm-outline'
              break
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tabs.Screen
        name="patients"
        options={{
          tabBarLabel: 'Pacientes',
        }}
      />
      <Tabs.Screen
        name="foodTracking"
        options={{
          tabBarLabel: 'Alimentación',
        }}
      />
      <Tabs.Screen
        name="alarms"
        options={{
          tabBarLabel: 'Alarmas',
        }}
      />
    </Tabs>
  )
}
