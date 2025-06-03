import { Picker } from '@react-native-picker/picker'
import {
  Pressable,
  Text,
  TextInput,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native'
import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import TimerPicker from 'components/TimePicker'
import CustomDayPicker from 'components/DayPicker'
import { createAlarm } from 'services/alarmService'
import { useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'
import SafeAreaContainer from 'components/safeAreaContainer'

const addAlarm = () => {
  const [patientId, setPatientId] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [notes, setNotes] = useState('')
  const [height, setHeight] = useState(40)
  const [time, setTime] = useState<string | null>(null)
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

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
      Toast.show({
        type: 'success',
        text1: 'Alarma creada correctamente',
      })
      router.replace('/(tabs)/alarms')
    } catch (error: any) {
      const errorMessage = error?.error || error?.message || 'Error desconocido'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100} // ajusta según tu header si tienes uno
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 16 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="border border-gray-300 p-5 rounded-md shadow py-4 bg-background">
              <Text className="text-lg">Número de cédula del paciente</Text>
              <TextInput
                className=" p-2 mb-4 bg-white rounded border border-gray-300 shadow-sm"
                value={patientId}
                returnKeyType="done"
                onChangeText={(value) => setPatientId(value)}
              />

              <Text className="text-lg">Nombre de la alarma</Text>
              <TextInput
                className="p-2 mb-4 bg-white rounded border border-gray-300 shadow-sm"
                value={name}
                returnKeyType="done"
                onChangeText={(value) => setName(value)}
              />

              <Text className="text-lg">Tipo de Alarma</Text>
              <Picker
                className="h-10 px-2 mb-4 rounded  border border-gray-300 shadow-sm"
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

              <View className="mb-4 wrap">
                <Text className="text-xl">Días de la semana</Text>
                <CustomDayPicker
                  selectedDays={daysOfWeek}
                  setSelectedDays={setDaysOfWeek}
                />
              </View>

              <View className="mb-4">
                <Text className=" text-xl ">Notas</Text>

                <TextInput
                  multiline
                  numberOfLines={6}
                  className=" bg-white rounded text-base border border-gray-300  shadow-sm"
                  value={notes}
                  onChangeText={setNotes}
                  blurOnSubmit={true}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  returnKeyType="done"
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
              </View>

              <Pressable
                onPress={handleSubmit}
                disabled={isSubmitting}
                className={`  rounded-xl p-4 my-4 shadow-md active:opacity-80 ${
                  isSubmitting ? 'bg-gray-400' : 'bg-primary'
                }`}
              >
                <Text className="text-center text-white text-lg">
                  {isSubmitting ? 'Guardando...' : 'Agregar Alarma'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  )
}

export default addAlarm
