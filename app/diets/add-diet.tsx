import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import SafeAreaContainer from 'components/safeAreaContainer'
import { ScrollView } from 'react-native'
import { router } from 'expo-router'
const AddDiet = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  return (
    <SafeAreaContainer>
      <ScrollView className="px-4 align-center">
        <View className="border border-gray-300 p-5 my-4 rounded-md shadow py-4 bg-background">
          <Text className="text-lg">Número de cédula del paciente</Text>
          <TextInput
            className=" p-2 mb-4 bg-white rounded border border-primary shadow-sm"
            value={name}
            onChangeText={(value) => setName(value)}
          />
          <Text className="text-lg">Descripcion</Text>
          <TextInput
            className=" p-2 mb-4 bg-white rounded border border-primary shadow-sm"
            value={name}
            onChangeText={(value) => setName(value)}
          />
          <Text className="text-lg">Notas</Text>
          <TextInput
            className=" p-2 mb-4 bg-white rounded border border-primary shadow-sm"
            value={name}
            onChangeText={(value) => setName(value)}
          />

          <Pressable
            onPress={() => {
              router.push('/diets')
            }}
            className="bg-blue-400 p-4 my-4 rounded-md bg-primary"
          >
            <Text className="text-center text-white text-lg">
              Agregar Dieta
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaContainer>
  )
}

export default AddDiet
