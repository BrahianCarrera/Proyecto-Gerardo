import { StyleSheet, Text, View } from 'react-native'
import 'global.css'

const index = () => {
  return (
    <View>
      <Text>index</Text>
      <View className="flex-1 items-center justify-center bg-blue-500">
        <Text className="text-white text-lg">NativeWind funciona</Text>
      </View>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})
