import Card from 'components/Card'
import { Picker } from '@react-native-picker/picker'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import TimerPicker from 'components/TimePicker'
import CustomDayPicker from 'components/DayPicker'
import { createAlarm } from 'services/alarmService'

const addAlarm = () => {
  const [patientId, SetPatientId] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [notes, setNotes] = useState('')
  const [height, setHeight] = useState(40)
  const [time, setTime] = useState<string | null>(null)
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!patientId.trim())
      return setError('Debes ingresar la cédula del paciente')
    if (!name.trim()) return setError('Debes ingresar un nombre para la alarma')
    if (!type) return setError('Debes seleccionar un tipo de alarma')
    if (!time) return setError('Debes seleccionar una hora')
    if (daysOfWeek.length === 0)
      return setError('Debes seleccionar al menos un día')

    setError(null)
    setIsSubmitting(true)

    const payload = {
      patientId,
      name,
      type,
      time,
      daysOfWeek,
      notes,
    }

    try {
      await createAlarm(payload)
    } catch (error: any) {
      const errorMessage = error?.error || error?.message || 'Error desconocido'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaProvider>
      <ScrollView className="px-4 align-center">
        <View className=" my-4 border border-gray-300 p-5 rounded-md shadow py-4 bg-background ">
          <Text className="text-center font-bold text-xl">Crear alarmas</Text>
          <Text className="text-lg">Número de cédula del paciente</Text>
          <TextInput
            className=" p-2 mb-4 bg-white rounded border border-primary shadow-sm"
            value={patientId}
            onChangeText={(value) => SetPatientId(value)}
          />

          <Text className="text-lg">Nombre de la alarma</Text>
          <TextInput
            className="p-2 mb-4 bg-white rounded border border-primary shadow-sm"
            value={name}
            onChangeText={(value) => setName(value)}
          />

          <Text className="text-lg">Tipo de Alarma</Text>
          <Picker
            className="h-10 px-2 mb-4 rounded  border border-primary shadow-sm"
            selectedValue={type}
            onValueChange={(itemValue) => setType(itemValue)}
            dropdownIconColor="#4F46E5"
          >
            <Picker.Item
              label="Selecciona un tipo..."
              value=""
              enabled={false}
            />
            <Picker.Item label="Suplemento" value="SUPLEMENTO" />
            <Picker.Item label="Medicamento" value="MEDICAMENTO" />
          </Picker>
          <View className="mb-4">
            <Text className="text-xl">Hora</Text>
            <TimerPicker time={time} setTime={setTime} />
          </View>

          <View className="mb-4">
            <Text className="text-xl">Días de la semana</Text>
            <CustomDayPicker
              selectedDays={daysOfWeek}
              setSelectedDays={setDaysOfWeek}
            />
          </View>

          <Text className=" text-xl ">Notas</Text>

          <TextInput
            multiline
            numberOfLines={6}
            className=" bg-white rounded text-base border border-primary shadow-sm"
            value={notes}
            onChangeText={setNotes}
            onContentSizeChange={(e) =>
              setHeight(e.nativeEvent.contentSize.height)
            }
            style={{ height }}
            textAlignVertical="top"
            placeholder="Escribe tu mensaje aquí..."
          />

          {error && (
            <Text className="text-red-600 font-medium text-base my-2 text-center">
              {error}
            </Text>
          )}

          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            className={` my-4 p-4 rounded-xl shadow-md active:opacity-80 ${
              isSubmitting ? 'bg-gray-400' : 'bg-primary'
            }`}
          >
            <Text className="text-center text-white text-lg">
              {isSubmitting ? 'Guardando...' : 'Agregar Alarma'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  )
}

export default addAlarm
