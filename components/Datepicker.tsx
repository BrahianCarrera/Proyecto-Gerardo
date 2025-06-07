import React, { useState } from 'react'
import { Platform, View, TextInput, Pressable, Text } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const isValidDateString = (value: string): boolean => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/
  if (!regex.test(value)) return false
  const [day, month, year] = value.split('/').map(Number)
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

const DateInput: React.FC<{
  date: Date
  onChange: (date: Date) => void
}> = ({ date, onChange }) => {
  const [show, setShow] = useState(false)
  const [inputValue, setInputValue] = useState(format(date, 'dd/MM/yyyy'))

  // 🖥 Web version: editable campo único con máscara implícita
  if (Platform.OS === 'web') {
    const handleChange = (text: string) => {
      // Solo permite números y /
      const cleaned = text.replace(/[^\d]/g, '')
      const parts = [
        cleaned.slice(0, 2),
        cleaned.slice(2, 4),
        cleaned.slice(4, 8),
      ].filter(Boolean)

      const formatted = parts.join('/')
      setInputValue(formatted)

      if (formatted.length === 10 && isValidDateString(formatted)) {
        const [day, month, year] = formatted.split('/').map(Number)
        const newDate = new Date(year, month - 1, day)
        onChange(newDate)
      }
    }

    return (
      <TextInput
        className="h-12 px-4 border border-gray-300 rounded-md text-base w-full tracking-widest"
        placeholder="DD/MM/AAAA"
        value={inputValue}
        onChangeText={handleChange}
        maxLength={10}
        keyboardType="numeric"
      />
    )
  }

  // 📱 Mobile: DateTimePicker
  return (
    <View>
      <Pressable
        onPress={() => setShow(true)}
        className="h-12 px-4 justify-center border border-gray-300 rounded-md bg-white"
      >
        <Text className="text-base text-gray-800">
          {format(date, "dd 'de' MMMM 'de' yyyy", { locale: es })}
        </Text>
      </Pressable>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShow(false)
            if (selectedDate) {
              onChange(selectedDate)
              setInputValue(format(selectedDate, 'dd/MM/yyyy'))
            }
          }}
        />
      )}
    </View>
  )
}

export default DateInput
