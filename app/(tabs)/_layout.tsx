import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="foodTracking" />
    </Tabs>
  )
}

export default TabLayout

const styles = StyleSheet.create({})
