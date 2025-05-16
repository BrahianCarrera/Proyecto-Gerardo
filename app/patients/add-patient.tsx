import { View, Text, TextInput, Pressable } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'

export default function AddPatient() {
  const router = useRouter()
  const [name, setName] = useState('')

  return (
    <View className="flex-1 px-6 pt-10">
      <Text className="text-lg font-bold mb-2">Nombre del paciente</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4"
        placeholder="Juan Pérez"
        value={name}
        onChangeText={setName}
      />

      <Pressable
        onPress={() => {
          // aquí puedes hacer el POST al backend
          console.log('Guardar paciente:', name)
          router.back() // vuelve a la pantalla anterior
        }}
        className="bg-green-500 p-4 rounded-md"
      >
        <Text className="text-center text-white text-lg">Guardar</Text>
      </Pressable>
    </View>
  )
}
