import { View, Text, ScrollView, TextInput, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import SafeAreaContainer from 'components/safeAreaContainer'
import { useRouter } from 'expo-router'
import PatientCard from 'components/PatientCard'
import { getDiets } from 'services/dietService'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

const Diets = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [allDiets, setAllDiets] = useState<any[]>([])
  const [filteredDiets, setFilteredDiets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useFocusEffect(
    useCallback(() => {
      const fetchDiets = async () => {
        setLoading(true)
        try {
          const data = await getDiets()
          setAllDiets(data)
          setFilteredDiets(data)
        } catch {
          setAllDiets([])
          setFilteredDiets([])
        } finally {
          setLoading(false)
        }
      }

      fetchDiets()
    }, []),
  )

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDiets(allDiets)
    } else {
      const lower = searchTerm.toLowerCase()
      const filtered = allDiets.filter((diet) =>
        diet.name.toLowerCase().includes(lower),
      )
      setFilteredDiets(filtered)
    }
  }, [searchTerm, allDiets])

  return (
    <SafeAreaContainer>
      <ScrollView className="px-6 pt-8">
        <View className="space-y-4">
          <TextInput
            className="border border-gray-300 rounded-md p-2 mb-2 bg-white"
            placeholder="Buscar Dieta"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />

          {!loading && filteredDiets.length === 0 && (
            <Text className="text-center text-gray-500">
              No se encontraron dietas
            </Text>
          )}

          {!loading &&
            filteredDiets.map((diet) => (
              <View key={diet.id}>
                <Pressable>
                  <View className="justify-between items-center bg-white p-4  my-2 border border-gray-300 rounded-md ">
                    <View className="flex-1 mr-2">
                      <Text
                        className="text-base font-medium mb-1"
                        numberOfLines={1}
                      >
                        {diet.name}
                      </Text>
                    </View>

                    <View className="flex-row flex-wrap gap-2 mt-2">
                      {diet.tags?.map((tag: string, index: number) => (
                        <View
                          key={index}
                          className="bg-secondary px-2 py-1 rounded"
                        >
                          <Text className="text-black text-xs">{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </Pressable>
              </View>
            ))}
        </View>

        <View>
          <Pressable
            onPress={() => {
              router.push('/diets/add-diet')
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

export default Diets
