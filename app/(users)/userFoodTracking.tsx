import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native' // Import Alert
import Card from 'components/Card'
import { useEffect, useState } from 'react'
import Header from 'components/Header'
import SafeAreaContainer from 'components/safeAreaContainer'
import { useUser } from 'app/context/UserContext'
import { getDietByPatientId } from 'services/dietService'
import Toast from 'react-native-toast-message'
import { logMeal } from 'services/mealService'
import { HelpCircle } from 'lucide-react-native'

interface Ingredient {
  name: string
  unit: string
  quantity: number
}
interface Meal {
  id: string
  name: string
  type: string
  size: string
  protein: number
  carbs: number
  calories: number
  sugar: number
  fat: number
  fiber: number
  sodium: number
  foodGroup: string
  tags: string[]
  ingredients: Ingredient[]
}
interface PatientInDiet {
  id: string
  name: string
  gender: string
  age: number | null
  weight: number
  height: number
  medicalHistory: string
  eatingHabits: string
  caregiverId: string | null
  dietId: string
  createdAt: string
}
interface Diet {
  id: string
  name: string
  description: string
  observations: string
  tags: string[]
  patients: PatientInDiet[]
  meals: Meal[]
}

interface ConsumableMeal extends Meal {
  isConsumed: boolean
}

interface GroupedMeals {
  [key: string]: ConsumableMeal[]
}

const mealTypeClasses: Record<string, string> = {
  desayuno: 'bg-yellow-100',
  almuerzo: 'bg-green-100',
  cena: 'bg-indigo-100',
  merienda: 'bg-pink-100',
  mediatarde: 'bg-orange-100',
  snack: 'bg-blue-100',
}

const FoodTracking = () => {
  const { user } = useUser()

  const [meals, setMeals] = useState<ConsumableMeal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [groupedMeals, setGroupedMeals] = useState<GroupedMeals>({})

  const mealTypeImages: Record<string, string> = {
    desayuno:
      'https://images.unsplash.com/photo-1504708706948-13d6cbba4062?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    almuerzo:
      'https://images.unsplash.com/photo-1627662236973-4fd8358fa206?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    cena: 'https://images.unsplash.com/photo-1608835291093-394b0c943a75?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    mediatarde:
      'https://images.unsplash.com/photo-1618902515708-0972a312344b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    merienda:
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  }

  const groupAndSetMeals = (mealsToGroup: ConsumableMeal[]) => {
    const mealOrder = ['desayuno', 'almuerzo', 'merienda', 'cena', 'mediatarde']

    const grouped = mealsToGroup.reduce((acc, meal) => {
      const type = meal.type.toLowerCase()
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(meal)
      return acc
    }, {} as GroupedMeals)

    const orderedGroupedMeals: GroupedMeals = {}
    mealOrder.forEach((type) => {
      if (grouped[type]) {
        orderedGroupedMeals[type] = grouped[type]
      }
    })

    Object.keys(grouped).forEach((type) => {
      if (!orderedGroupedMeals[type]) {
        orderedGroupedMeals[type] = grouped[type]
      }
    })

    setGroupedMeals(orderedGroupedMeals)
  }

  useEffect(() => {
    const fetchDietAndMeals = async () => {
      if (!user?.id) {
        setLoading(false)
        setError('ID de usuario no disponible.')
        return
      }
      try {
        setLoading(true)
        setError(null)
        const diets: Diet[] = await getDietByPatientId(user.id)

        if (diets && diets.length > 0) {
          const initialMeals: ConsumableMeal[] = diets[0].meals.map((meal) => ({
            ...meal,
            isConsumed: false,
          }))
          setMeals(initialMeals)
          groupAndSetMeals(initialMeals)
        } else {
          setMeals([])
          setGroupedMeals({})
          setError('No se encontraron dietas para este paciente.')
        }
      } catch (err) {
        console.error('Error fetching diet or meals:', err)
        setError('Error al cargar la información de la dieta.')
        setMeals([])
        setGroupedMeals({})
      } finally {
        setLoading(false)
      }
    }

    fetchDietAndMeals()
  }, [user])

  const handlePress = (MealId: string) => {
    const meal = meals.find((m) => m.id === MealId)

    if (!meal) {
      console.warn('Meal not found for ID:', MealId)
      return
    }

    const currentIsConsumed = meal.isConsumed

    if (!currentIsConsumed) {
      Alert.alert(
        'Confirmar Consumo',
        `¿Estás seguro de que quieres marcar "${meal.name}" como consumida?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Confirmar',
            onPress: () =>
              updateMealConsumptionStatus(meal.id, currentIsConsumed),
          },
        ],
        { cancelable: true },
      )
    } else {
      Alert.alert(
        'Marcar como No Consumida',
        `¿Quieres desmarcar "${meal.name}" como consumida?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Sí, desmarcar',
            onPress: () =>
              updateMealConsumptionStatus(meal.id, currentIsConsumed),
          },
        ],
        { cancelable: true },
      )
    }
  }

  const updateMealConsumptionStatus = async (
    mealId: string,
    currentIsConsumed: boolean,
  ) => {
    const updatedMeals = meals.map((meal) =>
      meal.id === mealId ? { ...meal, isConsumed: !currentIsConsumed } : meal,
    )
    setMeals(updatedMeals)
    groupAndSetMeals(updatedMeals) // Re-agrupar después de la actualización

    try {
      await logMeal({ patientId: user?.id, mealId: mealId })
      Toast.show({
        type: 'success',
        text1: 'Estado de comida actualizado',
      })
    } catch (error) {
      console.error('Error al actualizar el estado:', error)
      Toast.show({ type: 'error', text1: 'Error al actualizar estado' })

      const revertedMeals = meals.map((meal) =>
        meal.id === mealId ? { ...meal, isConsumed: currentIsConsumed } : meal,
      )
      setMeals(revertedMeals)
      groupAndSetMeals(revertedMeals)
    }
  }

  if (loading) {
    return (
      <SafeAreaContainer>
        <Header />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#14798B" />
          <Text className="mt-2 text-base text-gray-700">
            Cargando tus comidas...
          </Text>
        </View>
      </SafeAreaContainer>
    )
  }

  if (error) {
    return (
      <SafeAreaContainer>
        <Header />
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-600 text-lg text-center">{error}</Text>
        </View>
      </SafeAreaContainer>
    )
  }

  if (meals.length === 0) {
    return (
      <SafeAreaContainer>
        <Header />
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-gray-600 text-lg text-center">
            No hay comidas para mostrar en tu dieta.
          </Text>
        </View>
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer>
      <Header />
      <View className="flex-row justify-end gap-x-2 items-center px-4 py-2">
        <Text className="text-xl underline">
          Para más información sobre los tamaños
        </Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              'Información de la Dieta',
              'Aquí puedes mostrar las observaciones generales de la dieta o cualquier otra ayuda.',
            )
          }
        >
          <HelpCircle color="#14798B" size={32} />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-2">
        {Object.entries(groupedMeals).map(([type, mealsOfType]) => (
          <View key={type} className="mb-4">
            {(() => {
              const mealTypeClasses: Record<string, string> = {
                desayuno: 'bg-yellow-100',
                almuerzo: 'bg-green-100',
                cena: 'bg-red-100',
                merienda: 'bg-blue-100',
                mediatarde: 'bg-orange-100',
                snack: 'bg-blue-100',
              }
              const bgColor =
                mealTypeClasses[type.toLowerCase()] || 'bg-gray-100'

              return (
                <View className={`rounded-xl ${bgColor}`}>
                  <Text className="text-xl font-bold text-gray-800 capitalize px-2 py-2">
                    {type}
                  </Text>
                </View>
              )
            })()}
            {mealsOfType.map((meal) => (
              <Card
                key={meal.id}
                id={meal.id}
                title={meal.name}
                description={meal.calories.toString()}
                imageUrl={mealTypeImages[meal.type.toLowerCase()]}
                onPressCard={handlePress}
                isConsumed={meal.isConsumed}
                size={
                  meal.size.charAt(0).toUpperCase() +
                  meal.size.slice(1).toLowerCase()
                }
              />
            ))}
          </View>
        ))}
      </ScrollView>
      <Toast />
    </SafeAreaContainer>
  )
}

export default FoodTracking
