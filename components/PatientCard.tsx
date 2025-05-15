// components/PatientCard.jsx
import React from 'react'
import { View, Text } from 'react-native'

interface PatientCardProps {
  name: string
  diagnosis: string
  age: string
}

export default function PatientCard({
  name,
  diagnosis,
  age,
}: PatientCardProps) {
  return (
    <View className="flex-row justify-between items-center bg-white p-4 border border-gray-300 rounded-md mb-2">
      <View>
        <Text className="text-base font-medium">{name}</Text>
        <Text className="text-sm text-gray-600">{diagnosis}</Text>
      </View>
      <Text className="text-sm text-gray-700">{age} años</Text>
    </View>
  )
}
