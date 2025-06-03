import { View, Text, TextInput, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import SafeAreaContainer from 'components/safeAreaContainer'
import { ScrollView } from 'react-native'
import { router } from 'expo-router'
import { createDiet } from '../../services/dietService'

const AddDiet = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddDiet = async () => {
    if (!name || !description) {
      Alert.alert('Error', 'Nombre y descripción son obligatorios')
      return
    }

    const payload = {
      name,
      description,
      notes,
    }

    setLoading(true)
    try {
      const newDiet = await createDiet(payload)
      console.log('Redirecting to associateMeals with ID:', newDiet.id)
      router.push({
        pathname: '/diets/associateMeals',
        params: { dietId: newDiet.id },
      })
    } catch (err) {
      console.error(err)
      Alert.alert('Error', 'No se pudo crear la dieta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaContainer>
      <ScrollView className="px-4 align-center">
        <View className="border border-gray-300 p-5 my-4 rounded-md shadow py-4 bg-background">
          <Text className="text-lg">Nombre de la dieta</Text>
          <TextInput
            className="p-2 mb-4 bg-white rounded border border-primary shadow-sm"
            value={name}
            onChangeText={setName}
          />
          <Text className="text-lg">Descripción</Text>
          <TextInput
            className="p-2 mb-4 bg-white rounded border border-primary shadow-sm"
            value={description}
            multiline
            onChangeText={setDescription}
          />
          <Text className="text-lg">Notas</Text>
          <TextInput
            className="p-2 mb-4 bg-white rounded border border-primary shadow-sm"
            value={notes}
            onChangeText={setNotes}
          />

          <Pressable
            onPress={handleAddDiet}
            className="bg-blue-400 p-4 my-4 rounded-md bg-primary"
            disabled={loading}
          >
            <Text className="text-center text-white text-lg">
              {loading ? 'Guardando...' : 'Agregar Dieta y Asociar Comidas'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaContainer>
  )
}

export default AddDiet
