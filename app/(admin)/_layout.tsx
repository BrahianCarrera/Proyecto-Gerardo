import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { CircleUserRound, CookingPot } from 'lucide-react-native'
import SafeAreaContainer from 'components/safeAreaContainer'

export default function AdminLayout() {
  return (
    <SafeAreaContainer>
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
        <Tabs.Screen
          name="diets"
          options={{
            title: 'Dietas',
            headerTitle: 'Dietas ',
            tabBarIcon: ({ color, size }) => (
              <CookingPot size={size} color={color} />
            ),
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
      </Tabs>
    </SafeAreaContainer>
  )
}
