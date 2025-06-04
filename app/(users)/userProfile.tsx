import { View, Text } from 'react-native'
import React from 'react'
import SafeAreaContainer from 'components/safeAreaContainer'
import Header from 'components/Header'
import ProfileImagePicker from 'components/ProfileImagePicker'
import { useUser } from 'app/context/UserContext'
import { SettingsList } from 'components/SettingsList'

const userProfile = () => {
  const { user } = useUser()

  if (!user?.id) return

  return (
    <SafeAreaContainer>
      <Header />
      <View className="p-4">
        <Text className="text-xl text-gray-600">Bienvenido</Text>
        <Text className="font-bold text-2xl text-gray-700">{user.name}</Text>

        <View className="items-center">
          <ProfileImagePicker userId={user.id} backendUrl={'localhost:4000'} />
          <SettingsList></SettingsList>
        </View>
      </View>
    </SafeAreaContainer>
  )
}

export default userProfile
