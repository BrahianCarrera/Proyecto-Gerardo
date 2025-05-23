import { useEffect, useState } from 'react'
import { getAlarmsByPatient } from 'services/alarmService'
import { ScrollView, TextInput, View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import PatientCard from 'components/PatientCard'

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
      }
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [searchTerm])

  return (
    <ScrollView className="px-6">
      <View className="space-y-4">
        <Text className="text-lg font-bold">Alarmas</Text>

        <TextInput
          className="border border-gray-300 rounded-md p-2"
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
              <PatientCard
                name={alarm.patient.name}
                subtext={alarm.type}
                detail={alarm.name}
              />
            </View>
          ))}
      </View>

      <View>
        <Pressable
          onPress={() => {
            router.push('/alarms/add-alarm')
          }}
          className="bg-blue-400 p-4 my-4 rounded-md"
        >
          <Text className="text-center text-white text-lg">Agregar Alarma</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default AlarmMedicines
