import { useEffect, useState } from 'react'
import { getAlarmsByPatient } from 'services/alarmService'
import { ScrollView, TextInput, View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import AlarmCard from 'components/AlarmCard'

const AlarmMedicines = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [alarms, setAlarms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.length >= 5) {
        setLoading(true)
        getAlarmsByPatient(searchTerm)
          .then((res) => setAlarms(res))
          .catch((err) => {
            console.error('Error cargando alarmas', err)
            setAlarms([])
          })
          .finally(() => setLoading(false))
      } else {
        setAlarms([])
        console.log(alarms)
      }
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [searchTerm])

  return (
    <ScrollView className="px-6 pt-8">
      <View className="space-y-4">
        <TextInput
          className="border border-gray-300 rounded-md p-2 bg-white"
          placeholder="Buscar por cédula..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {!loading && alarms.length === 0 && searchTerm.length >= 5 && (
          <Text className="text-center text-gray-500">
            No se encontraron alarmas.
          </Text>
        )}

        {!loading &&
          alarms.map((alarm) => (
            <View key={alarm.id}>
              <AlarmCard
                key={alarm.id}
                name={alarm.patient.name}
                subtext={
                  alarm.type.charAt(0).toUpperCase() +
                  alarm.type.slice(1).toLowerCase()
                }
                detail={alarm.name}
                days={alarm.daysOfWeek}
              />
            </View>
          ))}
      </View>

      <View>
        <Pressable
          onPress={() => {
            router.push('/alarms/add-alarm')
          }}
          className="bg-blue-400 p-4 my-4 rounded-md bg-primary"
        >
          <Text className="text-center text-white text-lg bg-primary">
            Agregar Alarma
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default AlarmMedicines
