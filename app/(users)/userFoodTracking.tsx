import { StyleSheet, Text, View } from 'react-native'
import Card from 'components/Card'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import { getMeals } from '../../services/mealService'
import { ScrollView } from 'react-native'
import Header from 'components/Header'
import SafeAreaContainer from 'components/safeAreaContainer'
import { useUser } from 'app/context/UserContext'

const foodTracking = () => {
  const { user } = useUser()
  const [meals, setMeals] = useState<any[]>([])

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
    const fetchMeals = async () => {
      if (!user?.id) return

      try {
        const allMeals = await getMeals()
        const filteredMeals = allMeals.filter((meal: { diets: any[] }) =>
          meal.diets.some((diet: any) => diet.id === user.dietId),
        )
        setMeals(filteredMeals)
      } catch (err) {
        console.error('Error fetching meals:', err)
      }
    }

    fetchMeals()
  }, [])
  return (
    <SafeAreaContainer>
      <Header />
      <ScrollView className="px-2">
        {meals.map((meal) => (
          <Card
            key={meal.id}
            title={meal.name}
            description={
              meal.type.charAt(0).toUpperCase() +
              meal.type.slice(1).toLowerCase()
            }
            imageUrl={mealTypeImages[meal.type.toLowerCase()]}
          />
        ))}
      </ScrollView>
    </SafeAreaContainer>
  )
}

export default foodTracking
