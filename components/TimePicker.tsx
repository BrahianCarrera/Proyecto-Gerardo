// TimerPicker.tsx
import { TimerPickerModal } from 'react-native-timer-picker'
import React from 'react'
import { View, Pressable, TextInput } from 'react-native'

interface TimerPickerProps {
  time: string | null
  setTime: (value: string) => void
}

const TimerPicker: React.FC<TimerPickerProps> = ({ time, setTime }) => {
  const [showPicker, setShowPicker] = React.useState(false)

  const formatTime = ({
    hours,
    minutes,
  }: {
    hours?: number
    minutes?: number
  }) => {
    const timeParts = []

    if (hours !== undefined) {
      timeParts.push(hours.toString().padStart(2, '0'))
    }
    if (minutes !== undefined) {
      timeParts.push(minutes.toString().padStart(2, '0'))
    }

    return timeParts.join(':')
  }

  return (
    <View>
      <Pressable onPress={() => setShowPicker(true)}>
        <TextInput
          className="border p-2 mb-2 bg-white text-base rounded border border-primary shadow-sm"
          placeholder="Asignar hora a la alarma"
          value={time || '00:00'}
          editable={false}
        />
      </Pressable>
      <TimerPickerModal
        visible={showPicker}
        setIsVisible={setShowPicker}
        onConfirm={(pickedDuration) => {
          setTime(formatTime(pickedDuration))
          setShowPicker(false)
        }}
        modalTitle="Alarma"
        onCancel={() => setShowPicker(false)}
        closeOnOverlayPress
        hideSeconds
        styles={{
          confirmButton: {
            backgroundColor: '#14798B',
            borderColor: '#14798B',
            color: '#FFFFFF',
            fontWeight: 'bold',
          },
          cancelButton: {
            color: '#888888',
          },
        }}
      />
    </View>
  )
}

export default TimerPicker
