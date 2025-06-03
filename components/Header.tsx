import { View, Text } from 'react-native'

import Logo from '../assets/logo.svg'

export default function Header() {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow-sm border-b border-gray-300">
      <View className="flex-row items-center gap-x-2 ">
        <Logo width={40} height={40} />
        <Text className="text-xl font-bold text-gray-800">Gerardo</Text>
      </View>
    </View>
  )
}
