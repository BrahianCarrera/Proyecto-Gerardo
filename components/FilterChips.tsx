// components/FilterChips.tsx
import React from 'react'
import { View, Pressable, Text } from 'react-native'

type Props = {
  options: string[]
  selected: string[]
  onChange: (value: string[]) => void
  formatter?: (value: string) => string
}

const FilterChips = ({ options, selected, onChange, formatter }: Props) => {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <View className="flex-row flex-wrap gap-2 mt-2">
      {options.map((opt) => {
        const isActive = selected.includes(opt)
        return (
          <Pressable
            key={opt}
            onPress={() => toggle(opt)}
            className={`px-3 py-1 rounded-full border ${
              isActive ? 'bg-primary border-primary' : 'border-gray-400'
            }`}
          >
            <Text className={`${isActive ? 'text-white' : 'text-gray-800'}`}>
              {formatter ? formatter(opt) : opt}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

export default FilterChips
