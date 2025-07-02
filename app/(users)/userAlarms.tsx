import { View, Text, FlatList, ScrollView } from 'react-native'
import { useEffect, useState } from 'react'
import { getAlarmsByPatient } from '../../services/alarmService'
import { useUser } from '../context/UserContext'
import AlarmCard from 'components/AlarmCard'
import SafeAreaContainer from 'components/safeAreaContainer'
import Header from 'components/Header'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { syncLocalAlarms } from '../alarms/alarmUtils'
import AlarmModule, {
  removeAlarm,
  scheduleAlarm,
  stopAlarm,
} from 'expo-alarm-module'

export default function AlarmMedicinesScreen() {
  const { user } = useUser()
  const [alarms, setAlarms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasSynced, setHasSynced] = useState(false)

  function getNextDayOfWeekTime(
    dayOfWeek: number,
    hour: number,
    minute: number,
  ): Date {
    const now = new Date()
    const result = new Date()

    result.setDate(now.getDate() + ((7 + dayOfWeek - now.getDay()) % 7))
    result.setHours(hour, minute, 0, 0)

    if (result <= now) {
      result.setDate(result.getDate() + 7)
    }

    return result
  }

  const handleAlarms = async (alarms: any[]) => {
    for (const alarm of alarms) {
      await removeAlarm(alarm.id)
    }

    for (const alarm of alarms) {
      const [hour, minute] = alarm.time.split(':').map(Number)

      for (const dayOfWeek of alarm.daysOfWeek) {
        const now = new Date()
        const nextAlarmDate = getNextDayOfWeekTime(dayOfWeek, hour, minute)

        await scheduleAlarm({
          uid: alarm.id + '-' + dayOfWeek,
          day: nextAlarmDate,
          title: alarm.name,
          description: alarm.notes || '',
          showDismiss: true,
          showSnooze: true,
          snoozeInterval: 5,
          repeating: true,
          active: true,
        } as any)
      }
    }
  }

  const HAS_SYNCED_KEY = 'has_synced_alarms'

  useEffect(() => {
    const fetchAlarms = async () => {
      if (!user?.id) return

      const hasSynced = await AsyncStorage.getItem(HAS_SYNCED_KEY)
      if (hasSynced === 'true') return

      try {
        const data = await getAlarmsByPatient(user.id)
        setAlarms(data)
        await syncLocalAlarms(data)

        await AsyncStorage.setItem(HAS_SYNCED_KEY, 'true')
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
