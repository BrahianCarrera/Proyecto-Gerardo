import { Pressable, StyleSheet, Text, View } from 'react-native'
import Card from 'components/Card'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState, useCallback } from 'react' // Importa useCallback
import { getMeals } from '../../services/mealService'
import { ScrollView } from 'react-native'
import SafeAreaContainer from 'components/safeAreaContainer'
import { router } from 'expo-router'
import Header from 'components/Header'
import { useFocusEffect } from '@react-navigation/native' // Importa useFocusEffect

const foodTracking = () => {
  const [meals, setMeals] = useState<any[]>([])

  // Función para cargar las comidas
  const fetchMeals = async () => {
    try {
      const fetchedMeals = await getMeals()
      setMeals(fetchedMeals)
    } catch (error) {
      console.error('Error fetching meals:', error)
    }
  }

  // Usa useFocusEffect para recargar cuando la pantalla esté enfocada
  useFocusEffect(
    useCallback(() => {
      fetchMeals()
      // Retorna una función de limpieza si es necesario, aunque en este caso no lo es
      return () => {}
    }, []), // Dependencias vacías significan que el efecto se crea una vez y se ejecuta en cada foco
  )

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
              id={meal.id} // Asegúrate de pasar el ID real si lo tienes
              title={meal.name}
              description={
                meal.type.charAt(0).toUpperCase() +
                meal.type.slice(1).toLowerCase()
              }
              size={meal.size}
              isConsumed={false}
              imageUrl={mealTypeImages[meal.type.toLowerCase()]}
              onPressCard={() => console.log('Card Pressed:', meal.id)} // Aquí podrías navegar a los detalles
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
