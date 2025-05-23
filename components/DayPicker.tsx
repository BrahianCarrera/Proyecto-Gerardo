// CustomDayPicker.tsx
import React from 'react'
import { View, Text, Pressable } from 'react-native'

const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

interface Props {
  selectedDays: number[]
  setSelectedDays: React.Dispatch<React.SetStateAction<number[]>>
}

const CustomDayPicker: React.FC<Props> = ({
  selectedDays,
  setSelectedDays,
}) => {
  const toggleDay = (index: number) => {
    setSelectedDays((prev: number[]) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    )
  }

  return (
    <View className="flex-row justify-center flex-wrap items-center my-2">
      {days.map((day, index) => {
        const isSelected = selectedDays.includes(index)
        return (
          <Pressable
            key={index}
            onPress={() => toggleDay(index)}
            className={`w-7 h-7 rounded-full border items-center justify-center mx-1 ${
              isSelected
                ? 'bg-primary border-primary'
                : 'bg-white border-primary'
            }`}
          >
            <Text
              className={`text-sm ${isSelected ? 'text-white' : 'text-black'}`}
            >
              {day}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

export default CustomDayPicker
