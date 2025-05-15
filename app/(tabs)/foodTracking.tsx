import { StyleSheet, Text, View } from 'react-native'
import Card from 'components/Card'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import { getMeals } from '../../services/mealService'
import { ScrollView } from 'react-native'

const foodTracking = () => {
  const [meals, setMeals] = useState<any[]>([])

  useEffect(() => {
    getMeals().then(setMeals).catch(console.error)
  }, [])
  return (
    <SafeAreaView>
      <ScrollView>
        {meals.map((meal) => (
          <Card
            key={meal.id}
            title={meal.name}
            description="Un gato"
            imageUrl="https://placecats.com/neo_2/300/200"
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default foodTracking

const styles = StyleSheet.create({})
