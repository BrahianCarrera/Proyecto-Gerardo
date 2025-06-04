import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import Checkbox from 'expo-checkbox'
import { useLocalSearchParams, router } from 'expo-router'
import SafeAreaContainer from 'components/safeAreaContainer'

import { getMeals } from '../../services/mealService'
import { Divider } from 'react-native-paper'
import FilterChips from 'components/FilterChips'

import { assignMealsToDiet } from '../../services/dietService'

export default function AssignMealsToDiet() {
  const [meals, setMeals] = useState<any[]>([])
  const [selectedMeals, setSelectedMeals] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const types = [...new Set(meals.map((m) => m.type))]
  const groups = [...new Set(meals.map((m) => m.foodGroup))]
  const sizes = [...new Set(meals.map((m) => m.size))]

  const { dietId } = useLocalSearchParams<{ dietId: string }>()

  const [typeFilters, setTypeFilters] = useState<string[]>([])
  const [groupFilters, setGroupFilters] = useState<string[]>([])
  const [sizeFilters, setSizeFilters] = useState<string[]>([])

  const filteredMeals = meals.filter((meal) => {
    const typeMatch =
      typeFilters.length === 0 || typeFilters.includes(meal.type)
    const groupMatch =
      groupFilters.length === 0 || groupFilters.includes(meal.foodGroup)
    const sizeMatch =
      sizeFilters.length === 0 || sizeFilters.includes(meal.size)
    return typeMatch && groupMatch && sizeMatch
  })

  const toggleFilter = (value: string, current: string, setter: Function) => {
    if (value === current) setter('')
    else setter(value)
  }

  const toggleSelection = (mealId: string) => {
    setSelectedMeals((prev) =>
      prev.includes(mealId)
        ? prev.filter((id) => id !== mealId)
        : [...prev, mealId],
    )
  }
  const toTitleCase = (text: string) =>
    text
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\p{L}/gu, (c) => c.toLocaleUpperCase())

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const data = await getMeals()
        setMeals(data)
      } catch (err) {
        console.error('Error fetching meals:', err)
        Alert.alert('Error', 'No se pudieron cargar las comidas.')
      } finally {
        setLoading(false)
      }
    }

    fetchMeals()
  }, [])

  const handleSubmit = async () => {
    if (selectedMeals.length === 0) {
      Alert.alert('Selecciona al menos una comida.')
      return
    }

    setSubmitting(true)

    const payload = {
      dietId: dietId!,
      mealIds: selectedMeals,
    }

    try {
      await assignMealsToDiet(payload)

      Alert.alert('Éxito', 'Comidas asignadas correctamente.')
      router.back()
    } catch (err) {
      console.error(err)
      Alert.alert('Error', 'No se pudieron asignar las comidas.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <SafeAreaContainer>
        <ActivityIndicator size="large" className="mt-10" />
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer>
      <ScrollView className="px-4">
        <Text className="text-xl font-bold mb-4 text-center">
          Selecciona comidas para asociar
        </Text>

        <Text className="text-xl font-bold my-4 text-center">
          Filtrar comidas
        </Text>

        <View className="gap-y-2 mb-4">
          <FilterChips
            options={types}
            selected={typeFilters}
            onChange={setTypeFilters}
            formatter={toTitleCase}
          />

          <FilterChips
            options={groups}
            selected={groupFilters}
            onChange={setGroupFilters}
            formatter={toTitleCase}
          />

          <FilterChips
            options={sizes}
            selected={sizeFilters}
            onChange={setSizeFilters}
            formatter={(g) =>
              g
                .replace(/_/g, ' ')
                .toLowerCase()
                .replace(/^\w|\s\w/g, (c) => c.toLocaleUpperCase())
            }
          />
        </View>

        {filteredMeals.map((meal) => (
          <View
            key={meal.id}
            className=" border border-gray-300 p-4 mb-4 rounded-xl bg-white shadow border-l-4 border-l-primary"
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold">{meal.name}</Text>
              <Checkbox
                value={selectedMeals.includes(meal.id)}
                onValueChange={() => toggleSelection(meal.id)}
                color={selectedMeals.includes(meal.id) ? '#14798B' : undefined}
              />
            </View>
            <View className="flex-row justify-between flex-wrap">
              <Text className="w-1/2 pr-2">
                Tipo:{' '}
                {meal.type.charAt(0).toUpperCase() +
                  meal.type.slice(1).toLowerCase()}
              </Text>
              <Text className="w-1/2 pl-2">
                Tamaño:{' '}
                {meal.size.charAt(0).toUpperCase() +
                  meal.size.slice(1).toLowerCase()}
              </Text>
            </View>
            <View className="flex-row justify-between flex-wrap mt-1">
              <Text className="w-1/2 pr-2">
                Grupo alimenticio:{' '}
                {meal.foodGroup
                  .replace(/_/g, ' ')
                  .toLowerCase()
                  .replace(/\b\w/g, (c: any) => c.toUpperCase())}
              </Text>
              <Text className="w-1/2 pl-2" numberOfLines={1}>
                Etiquetas: {meal.tags?.join(', ')}
              </Text>
            </View>
            <Text className="mt-1 text-gray-600 text-sm" numberOfLines={2}>
              Ingredientes: {meal.ingredients?.ingredientes?.join(', ')}
            </Text>
          </View>
        ))}

        <Pressable
          onPress={handleSubmit}
          className="bg-primary p-4 rounded-xl mt-4 mb-10"
          disabled={submitting || selectedMeals.length === 0}
        >
          <Text className="text-white text-center text-lg">
            {submitting ? 'Asociando...' : 'Asociar comidas seleccionadas'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaContainer>
  )
}
