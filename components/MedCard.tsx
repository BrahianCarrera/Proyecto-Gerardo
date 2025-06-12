import { View, Text, TouchableOpacity } from 'react-native'
import { Pill } from 'lucide-react-native'

interface MedicineReminderCardProps {
  name: string
  times: string[]
  colors?: string[]
  isTaken?: boolean
}

export default function MedicineReminderCard({
  name,
  times,
  colors = [],
  isTaken = false,
}: MedicineReminderCardProps) {
  const formatTimeForDisplay = (timeString: string) => {
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString
    }

    try {
      const [hours, minutes] = timeString.split(':').map(Number)
      if (isNaN(hours) || isNaN(minutes)) {
        return timeString
      }

      const date = new Date()
      date.setHours(hours, minutes)

      return new Intl.DateTimeFormat('es-ES', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).format(date)
    } catch (e) {
      console.error('Error formatting time:', e)
      return timeString
    }
  }

  return (
    <View
      className={`flex-row items-center gap-4 shadow-md rounded-2xl p-4 mb-4 ${
        isTaken ? 'bg-green-100 border border-green-400' : 'bg-white'
      }`}
    >
      <View
        className={`p-3 rounded-xl ${
          isTaken
            ? 'bg-green-200 text-green-700'
            : 'bg-purple-100 text-purple-600'
        }`}
      >
        <Pill size={24} color={isTaken ? '#16A34A' : '#9333ea'} />{' '}
      </View>
      <View className="flex-1">
        <Text
          className={`text-base font-semibold ${
            isTaken ? 'text-green-800 line-through' : 'text-gray-800'
          }`}
        >
          {name}
        </Text>
        <View className="flex-row gap-2 mt-1 flex-wrap">
          {times.map((time, index) => (
            <Text
              key={index}
              className={`text-xs font-medium rounded-full px-3 py-1 ${
                colors[index] ||
                (isTaken
                  ? 'bg-green-300 text-green-900'
                  : 'bg-gray-300 text-black-900')
              }`}
            >
              {formatTimeForDisplay(time)}{' '}
            </Text>
          ))}
        </View>
      </View>
    </View>
  )
}
