import React, { useState } from 'react'
import { Platform, Pressable, View, Text } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { TextInput } from 'react-native'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const DateInput: React.FC<{
  date: Date
  onChange: (date: Date) => void
}> = ({ date, onChange }) => {
  const [show, setShow] = useState(false)

  // Versión Web: inputs individuales
  if (Platform.OS === 'web') {
    return (
      <View className="flex-row gap-2">
        <TextInput
          className="flex-1 h-12 px-4 border border-gray-300 rounded-md text-base"
          placeholder="Año"
          keyboardType="numeric"
          maxLength={4}
          onChangeText={(year) => {
            const newDate = new Date(date)
            newDate.setFullYear(Number(year))
            if (!isNaN(newDate.getTime())) onChange(newDate)
          }}
          value={date.getFullYear().toString()}
        />
        <TextInput
          className="flex-1 h-12 px-4 border border-gray-300 rounded-md text-base"
          placeholder="Mes"
          keyboardType="numeric"
          maxLength={2}
          onChangeText={(month) => {
            const newDate = new Date(date)
            newDate.setMonth(Number(month) - 1)
            if (!isNaN(newDate.getTime())) onChange(newDate)
          }}
          value={(date.getMonth() + 1).toString().padStart(2, '0')}
        />
        <TextInput
          className="flex-1 h-12 px-4 border border-gray-300 rounded-md text-base"
          placeholder="Día"
          keyboardType="numeric"
          maxLength={2}
          onChangeText={(day) => {
            const newDate = new Date(date)
            newDate.setDate(Number(day))
            if (!isNaN(newDate.getTime())) onChange(newDate)
          }}
          value={date.getDate().toString().padStart(2, '0')}
        />
      </View>
    )
  }

  // Versión móvil: botón de fecha formateada
  return (
    <View>
      <Pressable
        onPress={() => setShow(true)}
        className="h-12 px-4 justify-center border border-gray-300 rounded-md bg-white"
      >
        <Text className="text-base text-gray-800">
          {format(date, "d 'de' MMMM 'de' yyyy", { locale: es })}
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
            }
          }}
        />
      )}
    </View>
  )
}

export default DateInput
