import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { CircleUserRound, Pill } from 'lucide-react-native'

export default function UserTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#14798B',
        animation: 'shift',
        tabBarHideOnKeyboard: true,

        headerShown: false,
        tabBarStyle: {
          paddingBottom: 10,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="userFoodTracking"
        options={{
          title: 'Comidas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="userMeds"
        options={{
          title: 'Medicamentos',
          tabBarIcon: ({ color, size }) => <Pill size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="userProfile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <CircleUserRound size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="userAlarms"
        options={{
          title: 'alarms',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alarm" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
