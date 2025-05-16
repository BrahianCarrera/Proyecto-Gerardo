import React from 'react'
import { View, Text, Image, Pressable } from 'react-native'

interface CardProps {
  title: string
  description: string
  imageUrl?: string
  onPress?: () => void
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  onPress,
}) => {
  return (
    <View className="bg-white rounded-2xl p-4 m-4 shadow-md shadow-black/10 elevation-4">
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-40 rounded-xl mb-3"
          resizeMode="cover"
        />
      )}
      <Text className="text-xl font-bold text-neutral-900 mb-1">{title}</Text>
      <Text className="text-sm text-neutral-600 mb-3">{description}</Text>

      {onPress && (
        <Pressable className="bg-blue-600 py-2 rounded-lg" onPress={onPress}>
          <Text className="text-white text-center font-semibold">Ver más</Text>
        </Pressable>
      )}
    </View>
  )
}

export default Card
