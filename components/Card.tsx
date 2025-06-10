import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'

interface CardProps {
  id: string // The ID of the meal
  title: string
  description: string
  imageUrl: string
  // isConsumed prop is removed
  onPressCard: (mealId: string) => void // New prop: function to call when the card is pressed
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  imageUrl,
  onPressCard, // Destructure the new prop
}) => {
  return (
    <TouchableOpacity
      className="flex-row bg-white rounded-xl shadow-md my-2 mx-1 overflow-hidden items-center pr-2"
      onPress={() => onPressCard(id)} // Call onPressCard with the meal's ID
      activeOpacity={0.7} // Add a little visual feedback on press
    >
      <Image source={{ uri: imageUrl }} className="w-24 h-24 rounded-lg mr-2" />
      <View className="flex-1 py-2">
        <Text className="text-lg font-bold text-gray-800 mb-1">{title}</Text>
        <Text className="text-sm text-gray-600">{description}</Text>
      </View>
      {/* Remove the CheckCircle/Circle icons and "Consumido/Marcar" text */}
      {/* Also remove the conditional styling based on isConsumed */}
    </TouchableOpacity>
  )
}

export default Card
