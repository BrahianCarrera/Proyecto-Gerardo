import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import { Apple } from 'lucide-react-native'

interface CardProps {
  id: string
  title: string
  description: string
  imageUrl: string
  isConsumed: boolean
  onPressCard: (mealId: string) => void
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  imageUrl,
  isConsumed,
  onPressCard,
}) => {
  const cardContainerStyle = `flex-row bg-white rounded-xl shadow-md my-2 mx-1 overflow-hidden items-center pr-4 ${isConsumed ? 'opacity-60' : ''}`

  const textTitleStyle = `text-lg font-bold text-gray-800 mb-1 ${isConsumed ? 'line-through' : ''}`

  return (
    <Pressable className={cardContainerStyle} onPress={() => onPressCard(id)}>
      <Image source={{ uri: imageUrl }} className="w-24 h-24" />

      <View className="flex-1 py-2 px-3">
        <Text className={textTitleStyle}>{title}</Text>
        <Text className="text-sm text-gray-600">{description}</Text>
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
