import { AlarmClock } from 'lucide-react-native'
import { View, Text, Pressable } from 'react-native'

interface alarmCardProps {
  name: string
  subtext: string
  detail: string
  onPress?: () => void
  DownElement?: React.ReactNode
  variant?: 'default' | 'alarm'
  days?: number[]
}

const DAYS_MAP = [
  { id: 1, short: 'L', name: 'Lunes' },
  { id: 2, short: 'M', name: 'Martes' },
  { id: 3, short: 'X', name: 'Miércoles' },
  { id: 4, short: 'J', name: 'Jueves' },
  { id: 5, short: 'V', name: 'Viernes' },
  { id: 6, short: 'S', name: 'Sábado' },
  { id: 0, short: 'D', name: 'Domingo' },
]

export default function AlarmCard({
  name,
  subtext,
  detail,
  onPress,

  days = [],
}: alarmCardProps) {
  return (
    <Pressable onPress={onPress}>
      <View className="flex-row h-32 shadow-md justify-between items-center bg-white px-4 border border-gray-300 rounded-md mb-2 border-l-4 border-l-blue-500">
        <View className="flex-1 mr-2">
          <Text className="text-base font-medium mb-1" numberOfLines={1}>
            {name}
          </Text>
          <Text className="text-sm text-gray-600" numberOfLines={2}>
            {subtext}
          </Text>
        </View>

        <View className="flex-col items-center">
          <Text className="text-sm text-gray-700 mr-2" numberOfLines={1}>
            {detail}
          </Text>

          {days.length > 0 && (
            <View className="flex-row mt-2 space-x-1">
              {DAYS_MAP.map((day) => {
                const isActive = days.includes(day.id)
                return (
                  <View
                    key={day.id}
                    className="w-5 h-6 items-center justify-center relative"
                  >
                    {isActive && (
                      <View className="w-1 h-1 bg-primary rounded-full absolute top-0" />
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
