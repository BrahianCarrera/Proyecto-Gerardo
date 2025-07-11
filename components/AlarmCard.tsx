import { AlarmClock } from 'lucide-react-native' // Aunque AlarmClock no se usa, lo mantengo.
import { View, Text, Pressable } from 'react-native'

interface alarmCardProps {
  name: string
  subtext: string | undefined
  detail: string
  onPress?: () => void
  DownElement?: React.ReactNode // No se usa en el renderizado actual
  hour?: string
  variant?: 'default' | 'alarm' // No se usa para estilos condicionales en el código actual
  days?: number[]
}

const DAYS_MAP = [
  { id: 1, short: 'L', name: 'Lunes' },
  { id: 2, short: 'M', name: 'Martes' },
  { id: 3, short: 'X', name: 'Miércoles' },
  { id: 4, short: 'J', name: 'Jueves' },
  { id: 5, short: 'V', name: 'Viernes' },
  { id: 6, short: 'S', name: 'Sábado' },
  { id: 0, short: 'D', name: 'Domingo' }, // Domingo es 0 en JS Date getDay(), pero lo mantengo al final por tu orden
]

export default function AlarmCard({
  name,
  subtext,
  detail,
  onPress,
  hour,
  days = [],
}: alarmCardProps) {
  return (
    <Pressable onPress={onPress} className="mb-2 active:opacity-80">
      <View className="flex-row h-40 shadow-md justify-between items-center bg-white px-4 border border-gray-300 rounded-md border-l-4 border-l-blue-500">
        <View className="flex-1 mr-3 py-2 justify-center">
          <Text className="text-base font-semibold mb-1" numberOfLines={1}>
            {name}
          </Text>
          <Text className="text-md text-gray-600" numberOfLines={2}>
            {subtext}
          </Text>
          {hour && (
            <View className="mt-2 self-start">
              <Text className="px-2 py-0.5 text-sm font-medium rounded-full bg-gray-200 text-gray-800">
                {hour}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-col items-end justify-center ml-2 py-2">
          {detail && (
            <Text
              className="text-sm text-gray-700 text-right"
              numberOfLines={1}
            >
              {detail}
            </Text>
          )}
          {days.length > 0 && (
            <View className="flex-row mt-3 space-x-1 justify-end">
              {DAYS_MAP.map((day) => {
                const isActive = days.includes(day.id)
                return (
                  <View
                    key={day.id}
                    className="w-6 h-6 items-center justify-center relative"
                  >
                    {isActive && (
                      <View className="w-2 h-2 bg-primary rounded-full absolute -top-1.5  mx-auto" /> // Dot más visible y centrado arriba
                    )}
                    <Text
                      className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-gray-500'}`}
                    >
                      {day.short}
                    </Text>
                  </View>
                )
              })}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  )
}
