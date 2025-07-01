import { Pressable, StyleSheet, Text, View } from 'react-native'
import Card from 'components/Card'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import { getMeals } from '../../services/mealService'
import { ScrollView } from 'react-native'
import SafeAreaContainer from 'components/safeAreaContainer'
import { router } from 'expo-router'
import Header from 'components/Header'

const foodTracking = () => {
  const [meals, setMeals] = useState<any[]>([])

  useEffect(() => {
    getMeals().then(setMeals).catch(console.error)
  }, [])

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

  return (
    <SafeAreaProvider>
      <SafeAreaContainer>
        <Header />
        <ScrollView className="px-2">
          {meals.map((meal) => (
            <Card
              key={meal.id}
              id=""
              title={meal.name}
              description={
                meal.type.charAt(0).toUpperCase() +
                meal.type.slice(1).toLowerCase()
              }
              size={meal.size}
              isConsumed={false}
              imageUrl={mealTypeImages[meal.type.toLowerCase()]}
              onPressCard={() => console.log('')}
            />
          ))}
        </ScrollView>
        <Pressable
          onPress={() => router.push('/meals/addMeals')}
          className="bg-blue-400 p-4 my-4 rounded-md bg-primary"
        >
          <Text className="text-center text-white text-lg">Agregar Comida</Text>
        </Pressable>
      </SafeAreaContainer>
    </SafeAreaProvider>
  )
}

export default foodTracking
