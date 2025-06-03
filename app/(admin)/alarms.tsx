import { useCallback, useEffect, useState } from 'react'
import { getAlarmsByPatient } from 'services/alarmService'
import { ScrollView, TextInput, View, Text, Pressable } from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import AlarmCard from 'components/AlarmCard'
import React from 'react'
import { debounce } from 'lodash'
import SafeAreaContainer from 'components/safeAreaContainer'
import Header from 'components/Header'

const AlarmMedicines = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [alarms, setAlarms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const fetchAlarms = useCallback(
    debounce(async (term: string) => {
      if (term.length < 5) return

      setLoading(true)
      try {
        const data = await getAlarmsByPatient(term)
        setAlarms(data)
      } catch {
        setAlarms([])
      } finally {
        setLoading(false)
      }
    }, 500),
    [],
  )

  useEffect(() => {
    fetchAlarms(searchTerm)
    return () => fetchAlarms.cancel()
  }, [searchTerm, fetchAlarms])

  useFocusEffect(
    React.useCallback(() => {
      if (searchTerm.length >= 5) {
        fetchAlarms(searchTerm)
      }
    }, [searchTerm, fetchAlarms]),
  )

  return (
    <SafeAreaContainer>
      <Header />
      <ScrollView className="px-6 pt-8 bg-gray-100">
        <View className="space-y-4">
          <TextInput
            className="border border-gray-300 rounded-md p-2  mb-4 bg-white"
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
                  onPress={() =>
                    router.push({
                      pathname: `/alarms/${alarm.id}`,
                      params: { alarmId: alarm.id },
                    })
                  }
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
    </SafeAreaContainer>
  )
}

export default AlarmMedicines
