import { View, Text } from 'react-native'
import React from 'react'
import SafeAreaContainer from 'components/safeAreaContainer'
import Header from 'components/Header'
import ProfileImagePicker from 'components/ProfileImagePicker'
import { useUser } from 'app/context/UserContext'
import { SettingsList } from 'components/SettingsList'
import { Cake, Mail, UserRound } from 'lucide-react-native'

const userProfile = () => {
  const { user } = useUser()

  if (!user?.id) return

  const info = [
    {
      icon: <UserRound size={40} color="#14798B" />,
      title: 'Nombre',
      subtitle: user.name,
    },
    {
      icon: <Mail size={40} color="#14798B" />,
      title: 'Correo',
      subtitle: user.email,
    },
    {
      icon: <Cake size={40} color="#14798B" />,
      title: 'Cumpleaños',
      subtitle: '14 de mayo',
      onClick: () => console.log('Go to notifications'),
    },
  ]

  return (
    <SafeAreaContainer>
      <Header />
      <View className="p-4">
        <Text className="text-xl text-gray-600">Bienvenido</Text>
        <Text className="font-bold text-2xl text-gray-700">{user.name}</Text>

        <View className="items-center ">
          <View className="my-10">
            <ProfileImagePicker
              userId={user.id}
              backendUrl={'localhost:4000'}
            />
          </View>
          <SettingsList items={info} />
        </View>
      </View>
    </SafeAreaContainer>
  )
}

export default userProfile
