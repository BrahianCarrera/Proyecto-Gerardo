import { View, Text } from 'react-native'
import 'global.css'
import { router } from 'expo-router'
import LoginScreen from './landingpage/login'
import SafeAreaContainer from 'components/safeAreaContainer'
import { useEffect } from 'react'
import * as Notifications from 'expo-notifications'

const Index = () => {
  return (
    <SafeAreaContainer>
      <LoginScreen />
    </SafeAreaContainer>
  )
}

export default Index
