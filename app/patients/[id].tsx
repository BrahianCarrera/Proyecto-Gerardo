import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { getPatientById } from 'services/patientService'

export default function PatientDetail() {
  const { id } = useLocalSearchParams()
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof id === 'string') {
      getPatientById(id)
        .then(setPatient)
        .then(patient)
        .catch((err) => console.error('Error cargando paciente', err))
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-2 text-gray-600">Cargando paciente...</Text>
      </View>
    )
  }

  if (!patient) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Paciente no encontrado.</Text>
      </View>
    )
  }

  return (
    <ScrollView className="p-6">
      <Text className="text-2xl font-bold text-center mb-6">
        Información Detallada
      </Text>

      <View className="border border-gray-300 p-4 rounded-md shadow space-y-2">
        <View className="flex-row justify-between">
          <View className="w-1/2">
            <Text className="text-base font-bold mb-2">Documento:</Text>
            <Text className="text-base font-bold mb-2">Nombre:</Text>
            <Text className="text-base font-bold mb-2">Edad:</Text>
            <Text className="text-base font-bold mb-2">Diagnóstico:</Text>
            <Text className="text-base font-bold mb-2">
              Hábitos alimenticios:
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-base mb-2 break-words">
              Placeholder cedula?
            </Text>
            <Text className="text-base mb-2 break-words">{patient.name}</Text>
            <Text className="text-base mb-2">{patient.age} años</Text>
            <Text className="text-base mb-2 break-words">
              {patient.medicalHistory}
            </Text>
            <Text className="text-base mb-2 break-words">
              {patient.eatingHabits}
            </Text>
          </View>
        </View>

        <View className="items-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => console.log('hola')}
            className="bg-blue-500 rounded-lg py-2 px-6"
          >
            <Text className="text-white font-bold text-base">Editar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
