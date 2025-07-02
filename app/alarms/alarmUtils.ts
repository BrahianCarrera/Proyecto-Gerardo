import { scheduleAlarm, removeAlarm } from 'expo-alarm-module'

export async function syncLocalAlarms(alarms: any[]) {
  for (const alarm of alarms) {
    // Elimina alarmas anteriores para evitar duplicados
    for (const day of alarm.daysOfWeek) {
      await removeAlarm(alarm.id + '-' + day)
    }

    const [hour, minute] = alarm.time.split(':').map(Number)

    for (const dayOfWeek of alarm.daysOfWeek) {
      const date = getNextDayOfWeekTime(dayOfWeek, hour, minute)

      await scheduleAlarm({
        uid: alarm.id + '-' + dayOfWeek,
        day: date,
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

function getNextDayOfWeekTime(dayOfWeek: number, hour: number, minute: number): Date {
  const now = new Date()
  const result = new Date()

  result.setDate(now.getDate() + ((7 + dayOfWeek - now.getDay()) % 7))
  result.setHours(hour, minute, 0, 0)

  // Si ya pasó esa hora hoy
  if (result <= now) {
    result.setDate(result.getDate() + 7)
  }

  return result
}
