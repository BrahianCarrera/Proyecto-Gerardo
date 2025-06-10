import { View, Text, ActivityIndicator, ScrollView, Alert } from 'react-native' // Import Alert
import Card from 'components/Card'
import { useEffect, useState } from 'react'
import Header from 'components/Header'
import SafeAreaContainer from 'components/safeAreaContainer'
import { useUser } from 'app/context/UserContext'
import { getDietByPatientId } from 'services/dietService'
import Toast from 'react-native-toast-message'
import { logMeal } from 'services/mealService'

// --- Interfaces para tipar los datos de la API (las mismas que antes) ---
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

// Interfaz para la comida con su estado de consumo (still needed for logic)
interface ConsumableMeal extends Meal {
  isConsumed: boolean // Keep this internal to FoodTracking for state management
}

const FoodTracking = () => {
  const { user } = useUser()

  const [meals, setMeals] = useState<ConsumableMeal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          // Initialize all meals as not consumed
          const initialMeals: ConsumableMeal[] = diets[0].meals.map((meal) => ({
            ...meal,
            isConsumed: false,
          }))
          setMeals(initialMeals)
        } else {
          setMeals([])
          setError('No se encontraron dietas para este paciente.')
        }
      } catch (err) {
        console.error('Error fetching diet or meals:', err)
        setError('Error al cargar la información de la dieta.')
        setMeals([])
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
      // If already consumed, we can optionally ask to unmark or just unmark directly.
      // For this request, we'll assume no confirmation is needed to unmark.
      // If you want confirmation to unmark, you'd add another Alert.alert here.
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
    currentIsConsumed: boolean, // This is the state *before* the toggle
  ) => {
    // Optimistic update
    setMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal.id === mealId ? { ...meal, isConsumed: !currentIsConsumed } : meal,
      ),
    )

    try {
      const data = {
        patientId: user?.id,
        mealId: mealId,
        // You might need to send a `status` (e.g., true/false) to your API
        // if `logMeal` doesn't automatically toggle based on existence.
        // For now, assuming logMeal acts as a toggle or "mark as consumed"
      }
      await logMeal(data)

      Toast.show({
        type: 'success',
        text1: 'Estado de comida actualizado',
        text2: `La comida "${meals.find((m) => m.id === mealId)?.name}" ha sido marcada como ${!currentIsConsumed ? 'consumida' : 'no consumida'}.`,
        visibilityTime: 3000,
      })
    } catch (error) {
      console.error(
        'Error al actualizar el estado de consumo de la comida:',
        error,
      )
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar estado',
        text2:
          'No se pudo actualizar el estado de la comida. Intenta de nuevo.',
        visibilityTime: 4000,
      })
      // Revert optimistic update on error
      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal.id === mealId
            ? { ...meal, isConsumed: currentIsConsumed } // Revert to original state
            : meal,
        ),
      )
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
      <ScrollView className="px-2">
        {meals.map((meal) => (
          <Card
            key={meal.id}
            id={meal.id}
            title={meal.name}
            description={
              meal.type.charAt(0).toUpperCase() +
              meal.type.slice(1).toLowerCase()
            }
            isConsumed={meal.isConsumed}
            imageUrl={mealTypeImages[meal.type.toLowerCase()]}
            onPressCard={handlePress}
          />
        ))}
      </ScrollView>
    </SafeAreaContainer>
  )
}

export default FoodTracking
