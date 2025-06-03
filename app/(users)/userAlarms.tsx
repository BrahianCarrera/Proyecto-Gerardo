import { View, Text, FlatList, ScrollView } from 'react-native'
import { useEffect, useState } from 'react'
import { getAlarmsByPatient } from '../../services/alarmService'
import { useUser } from '../context/UserContext'
import AlarmCard from 'components/AlarmCard'
import SafeAreaContainer from 'components/safeAreaContainer'
import Header from 'components/Header'

export default function AlarmMedicinesScreen() {
  const { user } = useUser()
  const [alarms, setAlarms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    const fetchAlarms = async () => {
      try {
        const data = await getAlarmsByPatient(user.id)
        setAlarms(data)
      } catch (error) {
        console.error('Error al obtener alarmas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAlarms()
  }, [user?.id])
  return (
    <SafeAreaContainer>
      <Header />
      <View className="flex-1  px-4 pt-4">
        <Text className="text-3xl font-bold mb-10 text-gray-800">
          Alarmas programadas
        </Text>
        <ScrollView>
          {loading ? (
            <Text>Cargando alarmas...</Text>
          ) : alarms.length === 0 ? (
            <Text>No hay alarmas registradas.</Text>
          ) : (
            alarms.map((alarm) => (
              <View key={alarm.id}>
                <AlarmCard
                  key={alarm.id}
                  name={
                    alarm.type.charAt(0).toUpperCase() +
                    alarm.type.slice(1).toLowerCase()
                  }
                  subtext={alarm.notes}
                  detail={alarm.name}
                  days={alarm.daysOfWeek}
                />
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaContainer>
  )
}
