import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Pressable,
} from 'react-native'
import Checkbox from 'expo-checkbox'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState, useCallback } from 'react'

import {
  getDietById,
  updateDiet,
  deleteDiet,
  getMealsByDietId,
} from 'services/dietService'
import { getMeals } from 'services/mealService'
import SafeAreaContainer from 'components/safeAreaContainer'
import FilterChips from 'components/FilterChips'

interface Diet {
  id: string
  name: string
  description: string
  observations: string
  tags?: string[]
}

interface Meal {
  id: string
  name: string
  type: string
  foodGroup: string
  size: string
  tags?: string[]
  ingredients?: { ingredientes: string[] }
}

export default function DietDetail() {
  const { id } = useLocalSearchParams()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [isMealSelectionModalVisible, setIsMealSelectionModalVisible] =
    useState(false)

  const [diet, setDiet] = useState<Diet>({
    id: '',
    name: '',
    description: '',
    observations: '',
    tags: [],
  })

  const [allMeals, setAllMeals] = useState<Meal[]>([])
  const [selectedMealIds, setSelectedMealIds] = useState<string[]>([])
  const [initialSelectedMealIds, setInitialSelectedMealIds] = useState<
    string[]
  >([]) // Para revertir si se cancela el modal

  const [mealTypeFilters, setMealTypeFilters] = useState<string[]>([])
  const [mealGroupFilters, setMealGroupFilters] = useState<string[]>([])
  const [mealSizeFilters, setMealSizeFilters] = useState<string[]>([])

  const toTitleCase = (text: string) =>
    text
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\p{L}/gu, (c) => c.toLocaleUpperCase())

  const formatSize = (g: string) =>
    g
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/^\w|\s\w/g, (c) => c.toLocaleUpperCase())

  useEffect(() => {
    const fetchDietAndMeals = async () => {
      if (typeof id !== 'string') {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const dietData = await getDietById(id)
        if (dietData) {
          setDiet({
            id: dietData.id || '',
            name: dietData.name || '',
            description: dietData.description || '',
            observations: dietData.observations || '',
            tags: dietData.tags || [],
          })
        } else {
          Alert.alert('Advertencia', 'No se encontraron datos para esta dieta.')
        }

        const mealsData: Meal[] = await getMeals()
        setAllMeals(mealsData)

        const associatedMeals = await getMealsByDietId(id)
        if (associatedMeals) {
          const ids = associatedMeals.map((meal: Meal) => meal.id)
          setSelectedMealIds(ids)
          setInitialSelectedMealIds(ids) // Guardar el estado inicial para posible reversión
        }
      } catch (err) {
        console.error('Error cargando dieta o comidas:', err)
        Alert.alert(
          'Error',
          'No se pudo cargar la información de la dieta o las comidas.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDietAndMeals()
  }, [id])

  const toggleMealSelection = useCallback((mealId: string) => {
    setSelectedMealIds((prev) =>
      prev.includes(mealId)
        ? prev.filter((_id) => _id !== mealId)
        : [...prev, mealId],
    )
  }, [])

  const filteredMealsForModal = allMeals.filter((meal) => {
    const typeMatch =
      mealTypeFilters.length === 0 || mealTypeFilters.includes(meal.type)
    const groupMatch =
      mealGroupFilters.length === 0 || mealGroupFilters.includes(meal.foodGroup)
    const sizeMatch =
      mealSizeFilters.length === 0 || mealSizeFilters.includes(meal.size)
    return typeMatch && groupMatch && sizeMatch
  })

  const mealTypes = [...new Set(allMeals.map((m) => m.type))]
  const mealGroups = [...new Set(allMeals.map((m) => m.foodGroup))]
  const mealSizes = [...new Set(allMeals.map((m) => m.size))]

  const handleSave = async () => {
    try {
      if (typeof id === 'string') {
        const payload = {
          dietId: diet.id,
          name: diet.name,
          description: diet.description,
          observations: diet.observations,
          tags: diet.tags,
          mealIds: selectedMealIds,
        }

        await updateDiet(payload)
        setIsEditing(false)
        Alert.alert('Éxito', 'Dieta actualizada correctamente.')
      } else {
        console.error('ID de dieta inválido para guardar:', id)
        Alert.alert('Error', 'ID de dieta inválido.')
      }
    } catch (error) {
      console.error('Error al guardar cambios de la dieta:', error)
      Alert.alert('Error', 'No se pudieron guardar los cambios de la dieta.')
    }
  }

  const handleSaveMealAssociations = async () => {
    try {
      if (typeof id === 'string') {
        const payload = {
          dietId: diet.id,
          name: diet.name,
          description: diet.description,
          observations: diet.observations,
          tags: diet.tags,
          mealIds: selectedMealIds,
        }
        await updateDiet(payload)
        setInitialSelectedMealIds(selectedMealIds)
        Alert.alert('Éxito', 'Comidas asociadas actualizadas correctamente.')
        setIsMealSelectionModalVisible(false)
      } else {
        Alert.alert('Error', 'ID de dieta inválido para asociar comidas.')
      }
    } catch (error) {
      console.error('Error al guardar asociaciones de comidas:', error)
      Alert.alert(
        'Error',
        'No se pudieron guardar las asociaciones de comidas.',
      )
    }
  }

  const handleCancelMealSelection = () => {
    setSelectedMealIds(initialSelectedMealIds)
    setIsMealSelectionModalVisible(false)
  }

  const handleDelete = async () => {
    try {
      if (typeof id === 'string') {
        await deleteDiet(id)
        Alert.alert('Éxito', 'Dieta eliminada correctamente.')
        router.back()
      } else {
        console.error('ID de dieta inválido para eliminar:', id)
        Alert.alert('Error', 'ID de dieta inválido.')
      }
    } catch (error) {
      console.error('Error al eliminar la dieta:', error)
      Alert.alert('Error', 'No se pudo eliminar la dieta.')
    } finally {
      setIsDeleteModalVisible(false)
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-2 text-gray-600">Cargando dieta...</Text>
      </View>
    )
  }

  return (
    <SafeAreaContainer>
      <View className="flex-1 relative">
        <ScrollView className="px-6 pt-8">
          <View className="border border-gray-200 bg-white p-4 rounded-md shadow mb-4">
            <Text className="text-xl font-bold text-center mb-6">
              Información de la Dieta
            </Text>

            <View className="my-4">
              <Text className="text-base font-bold mb-1">Nombre:</Text>
              {isEditing ? (
                <TextInput
                  className="border border-primary p-2 bg-white rounded"
                  value={diet.name}
                  onChangeText={(text) => setDiet({ ...diet, name: text })}
                />
              ) : (
                <Text className="text-base break-words">{diet.name}</Text>
              )}
            </View>

            <View className="my-4">
              <Text className="text-base font-bold mb-1">Descripción:</Text>
              {isEditing ? (
                <TextInput
                  multiline
                  numberOfLines={4}
                  className="border border-primary p-2 bg-white rounded"
                  value={diet.description}
                  onChangeText={(text) =>
                    setDiet({ ...diet, description: text })
                  }
                />
              ) : (
                <Text className="text-base break-words">
                  {diet.description}
                </Text>
              )}
            </View>

            <View className="my-4">
              <Text className="text-base font-bold mb-1">Observaciones:</Text>
              {isEditing ? (
                <TextInput
                  multiline
                  numberOfLines={4}
                  className="border border-primary p-2 bg-white rounded"
                  value={diet.observations}
                  onChangeText={(text) =>
                    setDiet({ ...diet, observations: text })
                  }
                />
              ) : (
                <Text className="text-base break-words">
                  {diet.observations}
                </Text>
              )}
            </View>

            <View className="my-4">
              <Text className="text-base font-bold mb-1">Etiquetas:</Text>
              {isEditing ? (
                <TextInput
                  className="border border-primary p-2 bg-white rounded"
                  placeholder="Separar etiquetas por comas (ej: vegana, baja en sodio)"
                  placeholderTextColor="#9CA3AF"
                  value={diet.tags?.join(', ') || ''}
                  onChangeText={(text) =>
                    setDiet({
                      ...diet,
                      tags: text.split(',').map((tag) => tag.trim()),
                    })
                  }
                />
              ) : (
                <View className="flex-row flex-wrap gap-2 mt-1">
                  {diet.tags?.map((tag, index) => (
                    <View
                      key={index}
                      className="bg-secondary px-2 py-1 rounded"
                    >
                      <Text className="text-black text-xs">{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View className="border border-gray-300 bg-white p-4 rounded-md shadow gap-y-4 mt-4">
            <Text className="text-xl font-bold text-center mb-6">
              Comidas Asociadas
            </Text>

            {selectedMealIds.length === 0 ? (
              <Text className="text-center text-gray-500">
                No hay comidas asociadas a esta dieta.
              </Text>
            ) : (
              <View className="flex-wrap flex-row gap-2">
                {selectedMealIds.map((mealId) => {
                  const meal = allMeals.find((m) => m.id === mealId)
                  return meal ? (
                    <View
                      key={meal.id}
                      className="bg-blue-100 px-3 py-1 rounded-full border border-blue-300"
                    >
                      <Text className="text-blue-800 text-sm">{meal.name}</Text>
                    </View>
                  ) : null
                })}
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsMealSelectionModalVisible(true)}
              className="bg-primary rounded-lg px-6 py-2 items-center justify-center self-center w-64"
            >
              <Text className="text-white font-bold text-base text-center">
                Asociar/Modificar Comidas
              </Text>
            </TouchableOpacity>
          </View>

          <View className="border border-gray-300 bg-white p-4 rounded-md shadow gap-y-4 mt-4 mb-4">
            <Text className="text-xl font-bold text-center mb-6">Acciones</Text>

            <View className="flex-row justify-center gap-x-3  items-center mt-6">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={isEditing ? handleSave : () => setIsEditing(true)}
                className="bg-primary rounded-lg py-2 px-6"
              >
                <Text className="text-white font-bold text-base">
                  {isEditing ? 'Guardar' : 'Editar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsDeleteModalVisible(true)}
                className="bg-red-500 rounded-lg px-6 py-2 items-center justify-center self-center w-48"
              >
                <Text className="text-white font-bold text-base text-center">
                  Eliminar Dieta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {isDeleteModalVisible && (
          <View className="absolute inset-0 z-50 bg-black/50 items-center justify-center">
            <View className="bg-white w-4/5 p-6 rounded-xl shadow-lg">
              <Text className="text-lg font-bold text-center mb-4">
                ¿Estás seguro de que quieres eliminar esta dieta?
              </Text>

              <View className="flex-row justify-around mt-2">
                <TouchableOpacity
                  onPress={handleDelete}
                  className="bg-red-500 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white font-bold">Eliminar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsDeleteModalVisible(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg"
                >
                  <Text className="text-gray-800 font-bold">Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={isMealSelectionModalVisible}
          onRequestClose={handleCancelMealSelection}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white w-11/12 h-4/5 rounded-xl p-6 shadow-lg">
              <Text className="text-2xl font-bold text-center mb-4">
                Seleccionar Comidas
              </Text>

              <View className="gap-y-2 mb-4">
                <Text className="text-base font-semibold">
                  Filtrar por Tipo:
                </Text>
                <FilterChips
                  options={mealTypes}
                  selected={mealTypeFilters}
                  onChange={setMealTypeFilters}
                  formatter={toTitleCase}
                />

                <Text className="text-base font-semibold mt-2">
                  Filtrar por Grupo:
                </Text>
                <FilterChips
                  options={mealGroups}
                  selected={mealGroupFilters}
                  onChange={setMealGroupFilters}
                  formatter={toTitleCase}
                />

                <Text className="text-base font-semibold mt-2">
                  Filtrar por Tamaño:
                </Text>
                <FilterChips
                  options={mealSizes}
                  selected={mealSizeFilters}
                  onChange={setMealSizeFilters}
                  formatter={formatSize}
                />
              </View>

              <ScrollView className="flex-1 border border-gray-200 rounded-md p-2 mb-4">
                {filteredMealsForModal.length === 0 ? (
                  <Text className="text-center text-gray-500 mt-4">
                    No hay comidas que coincidan con los filtros.
                  </Text>
                ) : (
                  filteredMealsForModal.map((meal) => (
                    <View
                      key={meal.id}
                      className="flex-row items-center justify-between p-3 border-b border-gray-100"
                    >
                      <View className="flex-1 mr-2">
                        <Text className="text-base font-semibold">
                          {meal.name}
                        </Text>
                        <Text className="text-sm text-gray-600">
                          {toTitleCase(meal.type)} -{' '}
                          {toTitleCase(meal.foodGroup)}
                        </Text>
                      </View>
                      <Checkbox
                        value={selectedMealIds.includes(meal.id)}
                        onValueChange={() => toggleMealSelection(meal.id)}
                        color={
                          selectedMealIds.includes(meal.id)
                            ? '#14798B'
                            : undefined
                        }
                      />
                    </View>
                  ))
                )}
              </ScrollView>

              <View className="flex-row justify-around mt-2">
                <TouchableOpacity
                  onPress={handleSaveMealAssociations}
                  className="bg-primary rounded-lg px-6 py-3"
                >
                  <Text className="text-white font-bold text-base">
                    Guardar Cambios
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCancelMealSelection}
                  className="bg-gray-200 rounded-lg px-6 py-3"
                >
                  <Text className="text-gray-800 font-bold text-base">
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaContainer>
  )
}
