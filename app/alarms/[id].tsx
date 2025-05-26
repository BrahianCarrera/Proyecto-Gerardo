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
    <SafeAreaProvider>
      <Text>Hola</Text>
    </SafeAreaProvider>
  )
}
