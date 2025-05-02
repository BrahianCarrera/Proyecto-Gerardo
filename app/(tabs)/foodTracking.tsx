import { StyleSheet, Text, View } from 'react-native'
import Card from 'components/Card'
import { SafeAreaView } from 'react-native-safe-area-context'

const foodTracking = () => {
  return (
    <SafeAreaView>
      <View>
        <Card
          title="Gato"
          description="Un gato"
          imageUrl="https://placecats.com/neo_2/300/200"
        />
      </View>
    </SafeAreaView>
  )
}

export default foodTracking

const styles = StyleSheet.create({})
