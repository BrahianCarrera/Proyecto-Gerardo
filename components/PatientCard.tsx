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
        <View className="flex-1 mr-2">
          <Text className="text-base font-medium mb-1" numberOfLines={1}>
            {name}
          </Text>
          <Text className="text-sm text-gray-600" numberOfLines={2}>
            {subtext}
          </Text>
        </View>

        <View className="flex-col items-center">
          <Text className="text-sm text-gray-700 mr-2" numberOfLines={1}>
            {detail}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}
