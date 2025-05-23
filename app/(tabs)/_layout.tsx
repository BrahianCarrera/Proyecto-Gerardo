import { StyleSheet, Text, View } from 'react-native'
import { Tabs } from 'expo-router'

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="patients" />
      <Tabs.Screen name="foodTracking" />
      <Tabs.Screen name="alarms" />
    </Tabs>
  )
}

export default TabLayout

const styles = StyleSheet.create({})
