// components/PatientCard.jsx
import { View, Text, Pressable } from 'react-native'

interface PatientCardProps {
  name: string
  subtext: string
  detail: string
  onPress?: () => void
}

export default function PatientCard({
  name,
  subtext,
  detail,
  onPress,
}: PatientCardProps) {
  return (
    <Pressable onPress={onPress}>
      <View className="flex-row justify-between items-center bg-white p-4 border border-gray-300 rounded-md mb-2">
        <View>
          <Text className="text-base font-medium">{name}</Text>
          <Text className="text-sm text-gray-600 max-w-xs">{subtext}</Text>
        </View>
        <Text className="text-sm text-gray-700">{detail}</Text>
      </View>
    </Pressable>
  )
}
