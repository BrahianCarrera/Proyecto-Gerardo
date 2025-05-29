import { View, Text } from 'react-native'
import 'global.css'
import { router } from 'expo-router'

const Index = () => {
  return (
    <View>
      <Text>Pantalla Principal</Text>

      <Text
        className="mt-4 text-blue-600 underline"
        onPress={() => router.push('/(tabs)/foodtracking')}
      >
        Ir a Food Tracking
      </Text>

      <Text
        className="mt-4 text-blue-600 underline"
        onPress={() => router.push('/(tabs)/alarms')}
      >
        Configurar Alarmas
      </Text>

      <Text
        className="mt-4 text-blue-600 underline"
        onPress={() => router.push('users/login')}
      >
        Login
      </Text>
    </View>
  )
}

export default Index
