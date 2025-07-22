import { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
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

const handleAlarms = async (alarmsFromBackend: Alarm[]) => {
  console.log('Cancelando y reprogramando alarmas de Expo...')

  for (const alarm of alarmsFromBackend) {
    const [hour, minute] = alarm.time.split(':').map(Number)

    for (const dayOfWeek of alarm.daysOfWeek) {
      const nextAlarmDate = getNextDayOfWeekTime(dayOfWeek, hour, minute)
      const alarmUid = `${alarm.id}-${dayOfWeek}`

      await removeAlarm(alarmUid)

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
      console.log(
        `Alarma programada: ${alarm.name} para el día ${dayOfWeek} a las ${alarm.time}`,
      )
    }
  }
}

const BACKGROUND_ALARM_FETCH_TASK = 'background-alarm-fetch'

TaskManager.defineTask(BACKGROUND_ALARM_FETCH_TASK, async () => {
  try {
    const userId = await AsyncStorage.getItem(USER_ID_BACKGROUND_KEY)
    if (!userId) {
      console.log(
        'No se encontró ID de usuario para la tarea en segundo plano. No se sincronizarán las alarmas.',
      )
      return BackgroundTasks.BackgroundTaskResult.Failed
    }

    console.log('Ejecutando tarea en segundo plano para sincronizar alarmas...')
    const data: Alarm[] = await getAlarmsByPatient(userId)

    await syncLocalAlarms(data)
    await handleAlarms(data)

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
  const [fetchError, setFetchError] = useState<string | null>(null)

  const fetchAlarms = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      if (!user?.id) {
        throw new Error('Usuario no autenticado o ID de usuario no disponible.')
      }

      console.log('Obteniendo alarmas del backend...')
      const data: Alarm[] = await getAlarmsByPatient(user.id)
      setAlarms(data)

      await handleAlarms(data)

      console.log('Alarmas obtenidas del backend y programadas localmente.')
    } catch (error) {
      console.error('Error al obtener o programar alarmas:', error)
      setFetchError(
        'No se pudieron cargar las alarmas. Intenta de nuevo más tarde.',
      )
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

    const setupNotifications = async () => {
      await requestNotificationPermissions()

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      })
    }

    setupNotifications()

    const registerBackgroundFetchAsync = async () => {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        BACKGROUND_ALARM_FETCH_TASK,
      )
      if (!isRegistered) {
        await BackgroundTasks.registerTaskAsync(BACKGROUND_ALARM_FETCH_TASK, {
          minimumInterval: 60 * 15,
        })
        console.log(
          'Tarea de sincronización de alarmas en segundo plano registrada.',
        )
      } else {
        console.log(
          'Tarea de sincronización de alarmas en segundo plano ya registrada.',
        )
      }
    }

    registerBackgroundFetchAsync()

    if (user?.id) {
      AsyncStorage.setItem(USER_ID_BACKGROUND_KEY, user.id)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) {
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
      const testAlarmTime = new Date(now.getTime() + 5 * 1000)
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

      <View className="flex-1 px-4 pt-4 bg-white">
        <Text className="text-3xl font-bold mb-10 text-gray-800">
          Alarmas programadas
        </Text>

        <ScrollView>
          {loading ? (
            <View className="flex-1 justify-center items-center py-10">
              <ActivityIndicator size="large" color="#0000ff" />
              <Text className="mt-4 text-gray-600 text-lg">
                Cargando alarmas...
              </Text>
            </View>
          ) : fetchError ? (
            <View className="flex-1 justify-center items-center py-10">
              <Text className="text-red-500 text-lg text-center mb-4">
                {fetchError}
              </Text>
              <TouchableOpacity
                onPress={fetchAlarms}
                className="bg-blue-500 px-4 py-2 rounded-md"
              >
                <Text className="text-white text-base">Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : alarms.length === 0 ? (
            <View className="flex-1 justify-center items-center py-10">
              <Text className="text-gray-600 text-lg text-center">
                No tienes alarmas de medicamentos registradas.
              </Text>
              <Text className="text-gray-600 text-base text-center mt-2">
                ¡Agrega tu primera alarma para empezar!
              </Text>
            </View>
          ) : (
            alarms.map((alarm) => (
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
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaContainer>
  )
}
