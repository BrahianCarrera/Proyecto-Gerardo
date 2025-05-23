import { View, Text } from 'react-native'
import 'global.css'
import { router } from 'expo-router'

const Index = () => {
  return (
    <View>
      <Text>Pantalla Principal</Text>
      <View className="flex-1 items-center justify-center bg-blue-500">
        <Text className="text-white text-lg">NativeWind funciona</Text>
      </View>

      <Text
        className="mt-4 text-blue-600 underline"
        onPress={() => router.push('/foodTracking')}
      >
        Ir a Food Tracking
      </Text>

      {/* Nuevo enlace para la pantalla de alarmas */}
      <Text
        className="mt-4 text-blue-600 underline"
        onPress={() => router.push('/alarms')}
      >
        Configurar Alarmas
      </Text>
    </View>
  )
}

export default Index
