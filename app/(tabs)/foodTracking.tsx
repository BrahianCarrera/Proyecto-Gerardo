import { StyleSheet, Text, View } from 'react-native'
import Card from 'components/Card'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import { getMeals } from '../../services/mealService'
import { ScrollView } from 'react-native'

const foodTracking = () => {
  const [meals, setMeals] = useState<any[]>([])

  useEffect(() => {
    getMeals().then(setMeals).catch(console.error)
  }, [])
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top']}>
        <ScrollView className="px-6">
          {meals.map((meal) => (
            <Card
              key={meal.id}
              title={meal.name}
              description={meal.type}
              imageUrl="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=2026&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default foodTracking
