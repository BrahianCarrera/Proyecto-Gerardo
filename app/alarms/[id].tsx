import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'
import { getAlarmById, updateAlarm } from 'services/alarmService'
import TimePicker from 'components/TimePicker'
import CustomDayPicker from 'components/DayPicker'
import SafeAreaContainer from 'components/safeAreaContainer'

export default function AlarmDetail() {
  const { alarmId } = useLocalSearchParams()
  const [form, setForm] = useState({
    alarmId: alarmId,
    patientId: '',
    name: '',
    type: '',
    notes: '',
    time: '08:00',
    daysOfWeek: [] as number[],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [height, setHeight] = useState<number>(120)

  const router = useRouter()

  useEffect(() => {
    if (typeof alarmId === 'string') {
      getAlarmById(alarmId)
        .then((alarms) => {
          if (alarms.length > 0) {
            const alarm = alarms[0]
            console.log('Datos recibidos:', alarm)

            setForm({
              alarmId: alarmId,
              patientId: alarm.patientId,
              name: alarm.name,
              type: alarm.type,
              notes: alarm.notes || '',
              time: alarm.time || '08:00',
              daysOfWeek: alarm.daysOfWeek || [],
            })
          } else {
            setError('Alarma no encontrada')
          }
        })
        .catch((err) => {
          console.error('Error loading alarm:', err)
          setError('Failed to load alarm')
        })
        .finally(() => {
          setLoading(false)

          setTimeout(() => console.log('Estado actual:', form), 100)
        })
    }
  }, [alarmId])

  const handleSubmit = async () => {
    const { patientId, name, type, time, daysOfWeek } = form
    if (typeof alarmId !== 'string') return setError('Invalid alarm ID')
    if (!patientId.trim()) return setError('Patient ID is required')
    if (!name.trim()) return setError('Alarm name is required')
    if (!type) return setError('Alarm type is required')
    if (!time) return setError('Time is required')
    if (daysOfWeek.length === 0) return setError('Select at least one day')

    setIsSubmitting(true)

    try {
      await updateAlarm(form)
      Toast.show({
        type: 'success',
        text1: 'Alarm updated successfully',
      })
      router.back()
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error updating alarm',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    )
  }

  return (
    <SafeAreaContainer>
      <ScrollView className="px-4 align-center">
        <View className=" my-4 border border-gray-300 p-5 rounded-md shadow py-4 bg-background ">
          <Text className="text-center font-bold text-xl">Editar alarma</Text>
          <Text className="text-lg">Número de cédula del paciente</Text>
          <TextInput
            className=" p-2 mb-4 bg-white rounded border border-primary shadow-sm"
            value={form.patientId}
            onChangeText={(value) => setForm({ ...form, patientId: value })}
            editable={false}
          />

          <Text className="text-lg">Nombre de la alarma</Text>
          <TextInput
            className="p-2 mb-4 bg-white rounded border border-primary shadow-sm"
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />

          <Text className="text-lg">Tipo de Alarma</Text>
          <Picker
            className="h-10 px-2 mb-4 rounded  border border-primary shadow-sm"
            selectedValue={form.type}
            onValueChange={(value) => setForm({ ...form, name: value })}
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
            <TimePicker
              time={form.time}
              setTime={(time) => setForm({ ...form, time })}
            />
          </View>

          <View className="mb-4 wrap">
            <Text className="text-xl">Días de la semana</Text>
            <CustomDayPicker
              selectedDays={form.daysOfWeek}
              setSelectedDays={(days) =>
                setForm((prev) => ({
                  ...prev,
                  daysOfWeek:
                    typeof days === 'function' ? days(prev.daysOfWeek) : days,
                }))
              }
            />
          </View>

          <Text className=" text-xl ">Notas</Text>

          <TextInput
            multiline
            numberOfLines={6}
            className=" bg-white rounded text-base border border-primary shadow-sm"
            value={form.notes}
            onChangeText={(value) => setForm({ ...form, notes: value })}
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
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaContainer>
  )
}
