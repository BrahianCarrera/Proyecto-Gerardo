// components/MedsList.tsx
import { FC } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Divider } from 'react-native-paper'

interface MedItemProps {
  icon?: React.ReactNode
  name: string
  dosage: string
  frequency?: string
  onClick?: () => void
}

interface MedsListProps {
  meds: MedItemProps[]
}

const MedItem: FC<MedItemProps> = ({
  icon,
  name,
  dosage,
  frequency,
  onClick,
}) => (
  <Pressable
    className="flex-row justify-between items-center py-4 px-2 rounded-xl"
    onPress={onClick}
  >
    <View className="flex-row gap-4 items-center flex-1">
      {icon && (
        <View className="w-14 h-14 bg-blue-100 rounded-full items-center justify-center">
          {icon}
        </View>
      )}
      <View className="flex-1">
        <Text className="text-xl font-semibold text-black" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-base text-gray-600" numberOfLines={1}>
          {dosage}
        </Text>
        {frequency && (
          <Text className="text-sm text-gray-400" numberOfLines={1}>
            {frequency}
          </Text>
        )}
      </View>
    </View>
  </Pressable>
)

export const MedsList: FC<MedsListProps> = ({ meds }) => {
  return (
    <View className="bg-white shadow-sm rounded-2xl p-4 space-y-2 w-full max-w-md self-center">
      {meds.map((med, index) => (
        <View key={index}>
          <MedItem {...med} />
          {index < meds.length - 1 && <Divider />}
        </View>
      ))}
    </View>
  )
}
