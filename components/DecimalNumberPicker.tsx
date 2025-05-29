import React from 'react'
import { View, Text } from 'react-native'
import { Picker } from '@react-native-picker/picker'

type Props = {
  label: string
  integerValue: number
  decimalValue: number
  onIntegerChange: (value: number) => void
  onDecimalChange: (value: number) => void
  min: number
  max: number
  unit?: string
}

export default function DecimalNumberPicker({
  label,
  integerValue,
  decimalValue,
  onIntegerChange,
  onDecimalChange,
  min,
  max,
  unit,
}: Props) {
  const integers = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const decimals = Array.from({ length: 10 }, (_, i) => i) // 0 a 9

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      <View className="flex-row border border-gray-300 rounded-md overflow-hidden">
        <View className="flex-1">
          <Picker
            selectedValue={integerValue}
            onValueChange={(val) => onIntegerChange(val)}
          >
            {integers.map((n) => (
              <Picker.Item key={n} label={`${n}`} value={n} />
            ))}
          </Picker>
        </View>
        <Text className="text-lg px-2 self-center text-gray-500">.</Text>
        <View className="w-[80px]">
          <Picker
            selectedValue={decimalValue}
            onValueChange={(val) => onDecimalChange(val)}
          >
            {decimals.map((d) => (
              <Picker.Item key={d} label={`${d}`} value={d} />
            ))}
          </Picker>
        </View>
        {unit && (
          <Text className="self-center px-2 text-gray-600 text-base">
            {unit}
          </Text>
        )}
      </View>
    </View>
  )
}
