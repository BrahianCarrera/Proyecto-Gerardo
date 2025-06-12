import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import { Apple, Flame, Soup } from 'lucide-react-native'

interface CardProps {
  id: string
  title: string
  description: string
  imageUrl: string
  isConsumed: boolean
  onPressCard: (mealId: string) => void
  size: string
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  imageUrl,
  isConsumed,
  onPressCard,
  size,
}) => {
  const cardContainerStyle = `flex-row bg-white rounded-xl shadow-md my-2 mx-1 overflow-hidden items-center pr-4 ${isConsumed ? 'opacity-60' : ''}`

  const textTitleStyle = `text-lg font-bold text-gray-800 mb-1 ${isConsumed ? 'line-through' : ''}`

  return (
    <Pressable className={cardContainerStyle} onPress={() => onPressCard(id)}>
      <Image source={{ uri: imageUrl }} className="w-32 h-32" />

      <View className="flex-1 py-2 px-3">
        <Text className={textTitleStyle}>{title}</Text>
        <View className="flex-row  gap-x-1 items-center">
          <Soup size={20} color="#374151" />
          <Text className="text-sm text-gray-700">{size}</Text>
        </View>
        <View className="flex-row  items-center">
          <Flame size={20} color="#374151" />
          <Text className="text-sm text-gray-700">
            {' '}
            Calorias: {description}
          </Text>
        </View>
      </View>

      {isConsumed && (
        <View className="p-2 bg-green-100 rounded-full">
          <Apple size={24} color="#16A34A" />
        </View>
      )}
    </Pressable>
  )
}

export default Card
