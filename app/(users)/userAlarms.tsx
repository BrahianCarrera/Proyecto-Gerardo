import { useEffect, useState, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { removeAlarm, scheduleAlarm } from 'expo-alarm-module'
import * as TaskManager from 'expo-task-manager'
import * as BackgroundTasks from 'expo-background-task'
import * as Notifications from 'expo-notifications'

import { useUser } from '../context/UserContext'
import AlarmCard from 'components/AlarmCard'
import SafeAreaContainer from 'components/safeAreaContainer'
import Header from 'components/Header'

import { getAlarmsByPatient } from '../../services/alarmService'
import { syncLocalAlarms } from '../alarms/alarmUtils'

const HAS_SYNCED_KEY = 'has_synced_alarms'
const ALARMS_DATA_KEY = 'local_alarms_data'
const USER_ID_BACKGROUND_KEY = 'user_id_for_background_tasks'

interface Alarm {
  id: string
  name: string
  notes?: string
  type: string
  time: string
  daysOfWeek: number[]
}

const getNextDayOfWeekTime = (
  dayOfWeek: number,
  hour: number,
  minute: number,
): Date => {
  const now = new Date()
  const result = new Date(now)

  const currentDay = now.getDay()
  let daysToAdd = dayOfWeek - currentDay
  if (daysToAdd < 0) {
    daysToAdd += 7
  }

  result.setDate(now.getDate() + daysToAdd)
  result.setHours(hour, minute, 0, 0)

  if (result.getTime() <= now.getTime()) {
    result.setDate(result.getDate() + 7)
  }

  return result
}

const handleAlarms = async (alarmsToHandle: Alarm[]) => {
  for (const alarm of alarmsToHandle) {
    await removeAlarm(alarm.id)
  }

  for (const alarm of alarmsToHandle) {
    const [hour, minute] = alarm.time.split(':').map(Number)

    for (const dayOfWeek of alarm.daysOfWeek) {
      const nextAlarmDate = getNextDayOfWeekTime(dayOfWeek, hour, minute)
      const alarmUid = `${alarm.id}-${dayOfWeek}`

      await scheduleAlarm({
        uid: alarmUid,
        day: nextAlarmDate,
        title: alarm.name,
        description: alarm.notes || '',
        showDismiss: true,
        showSnooze: true,
        snoozeInterval: 5,
        repeating: true,
        active: true,
        dismissText: 'Descartar',
        snoozeText: 'Posponer 5 mins',
      } as any)
    }
  }
}

const BACKGROUND_ALARM_FETCH_TASK = 'background-alarm-fetch'

TaskManager.defineTask(BACKGROUND_ALARM_FETCH_TASK, async () => {
  try {
    const userId = await AsyncStorage.getItem(USER_ID_BACKGROUND_KEY)
    if (!userId) {
      console.log(
        'No se encontró ID de usuario para la tarea en segundo plano.',
      )
      return BackgroundTasks.BackgroundTaskResult.Failed
    }

    console.log('Ejecutando tarea en segundo plano para sincronizar alarmas...')
    const data: Alarm[] = await getAlarmsByPatient(userId)
    await syncLocalAlarms(data)
    await handleAlarms(data)
    await AsyncStorage.setItem(HAS_SYNCED_KEY, 'true')
    await AsyncStorage.setItem(ALARMS_DATA_KEY, JSON.stringify(data))

    console.log('Sincronización de alarmas en segundo plano completada.')
    return BackgroundTasks.BackgroundTaskResult.Success
  } catch (error) {
    console.error(
      'Error en la sincronización de alarmas en segundo plano:',
      error,
    )
    return BackgroundTasks.BackgroundTaskResult.Failed
  }
})

export default function AlarmMedicinesScreen() {
  const { user } = useUser()
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAlarms = useCallback(async () => {
    console.log('Usuario:', user)
    setLoading(true)

    try {
      if (!user?.id) {
        throw new Error('Usuario no disponible o ID de usuario no encontrado.')
      }

      const hasSyncedLocal = await AsyncStorage.getItem(HAS_SYNCED_KEY)
      const storedAlarmsJson = await AsyncStorage.getItem(ALARMS_DATA_KEY)

      if (hasSyncedLocal === 'true' && storedAlarmsJson) {
        const parsedAlarms: Alarm[] = JSON.parse(storedAlarmsJson)
        setAlarms(parsedAlarms)
        console.log('Alarmas cargadas desde AsyncStorage.')
        setLoading(false)
        return
      }

      console.log('Obteniendo alarmas del backend...')
      const data: Alarm[] = await getAlarmsByPatient(user.id)
      setAlarms(data)

      await syncLocalAlarms(data)
      await handleAlarms(data)
      await AsyncStorage.setItem(HAS_SYNCED_KEY, 'true')
      await AsyncStorage.setItem(ALARMS_DATA_KEY, JSON.stringify(data))

      console.log(
        'Alarmas obtenidas del backend, sincronizadas y guardadas localmente.',
      )
    } catch (error) {
      console.error('Error al obtener o programar alarmas:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    const requestNotificationPermissions = async () => {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permisos de Notificación Necesarios',
          'Para que las alarmas funcionen correctamente, la aplicación necesita permisos para enviar notificaciones. Por favor, habilítalos en la configuración de tu dispositivo.',
        )
        return false
      }

      return true
    }

    requestNotificationPermissions()

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    })

    const registerBackgroundFetchAsync = async () => {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        BACKGROUND_ALARM_FETCH_TASK,
      )
      if (!isRegistered) {
        await BackgroundTasks.registerTaskAsync(BACKGROUND_ALARM_FETCH_TASK, {
          minimumInterval: 60 * 15, // 15 minutos
        })
        console.log(
          'Tarea de sincronización de alarmas en segundo plano registrada.',
        )
      }
    }

    registerBackgroundFetchAsync()

    if (user?.id) {
      AsyncStorage.setItem(USER_ID_BACKGROUND_KEY, user.id)
      fetchAlarms()
    }
  }, [user?.id, fetchAlarms])

  const scheduleTestAlarm = async () => {
    const { status } = await Notifications.getPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        'Permisos Denegados',
        'No se pueden programar alarmas de prueba porque no hay permisos de notificación.',
      )
      return
    }

    try {
      const now = new Date()
      const testAlarmTime = new Date(now.getTime() + 5 * 1000) // 5 segundos en el futuro
      const testAlarmUid = `test-alarm-${Date.now()}`

      await scheduleAlarm({
        uid: testAlarmUid,
        day: testAlarmTime,
        title: 'Alarma de Prueba',
        description: '¡Es hora de tu medicamento de prueba!',
        showDismiss: true,
        showSnooze: true,
        snoozeInterval: 1,
        repeating: false,
        active: true,
        dismissText: 'Entendido',
        snoozeText: 'Posponer',
      } as any)

      Alert.alert(
        'Alarma de Prueba Programada',
        'Se ha programado una alarma para dentro de 5 segundos. Asegúrate de tener la app en segundo plano o cerrada para ver la notificación.',
      )
    } catch (error) {
      console.error('Error al programar alarma de prueba:', error)
      Alert.alert('Error', 'No se pudo programar la alarma de prueba.')
    }
  }

  return (
    <SafeAreaContainer>
      <Header />

      <View className="flex-1 px-4 pt-4">
        <Text className="text-3xl font-bold mb-10 text-gray-800">
          Alarmas programadas
        </Text>

        <TouchableOpacity
          onPress={scheduleTestAlarm}
          className="bg-blue-500 rounded-lg py-3 px-6 mb-4 self-center"
        >
          <Text className="text-white text-lg font-semibold">
            Agendar Alarma de Prueba
          </Text>
        </TouchableOpacity>

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
                  hour={alarm.time}
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
