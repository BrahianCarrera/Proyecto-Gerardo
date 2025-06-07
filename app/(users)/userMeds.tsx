import { View, Text } from 'react-native'
import React from 'react'
import SafeAreaContainer from 'components/safeAreaContainer'
import Header from 'components/Header'
import { MedsList } from 'components/MedsList'

const userMeds = () => {
  return (
    <SafeAreaContainer>
      <Header />
    </SafeAreaContainer>
  )
}

export default userMeds
