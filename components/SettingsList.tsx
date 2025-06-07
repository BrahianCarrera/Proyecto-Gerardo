// components/SettingsList.tsx
import { FC } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Divider } from 'react-native-paper'

interface SettingItemProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  onClick?: () => void
}

interface SettingsListProps {
  items: SettingItemProps[]
}

const SettingItem: FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onClick,
}) => (
  <Pressable
    className="flex-row justify-between items-center py-4 px-2 rounded-xl"
    onPress={onClick}
  >
    <View className="flex-row gap-4 items-center flex-1">
      <View className="w-14 h-14 bg-gray-100 rounded-full items-center justify-center">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-xl font-semibold text-black" numberOfLines={0}>
          {title}
        </Text>
        {subtitle && (
          <Text className="text-2xl text-gray-500" numberOfLines={0}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  </Pressable>
)

export const SettingsList: FC<SettingsListProps> = ({ items }) => {
  return (
    <View className="bg-white shadow-sm rounded-2xl p-4 space-y-2 w-full max-w-md self-center">
      {items.map((item, index) => (
        <View key={index}>
          <SettingItem {...item} />
          {index < items.length - 1 && <Divider />}
        </View>
      ))}
    </View>
  )
}
