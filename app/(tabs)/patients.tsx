import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useCallback, useEffect, useState } from 'react'
import { getPatients } from 'services/patientService'
import PatientCard from 'components/PatientCard'
import { ScrollView, TextInput, View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'

const Patients = () => {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    getPatients()
      .then(setPatients)
      .catch((err) => console.error('Error cargando pacientes', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useFocusEffect(
    useCallback(() => {
      getPatients().then(setPatients)
    }, []),
  )

  return (
    <SafeAreaProvider>
      <ScrollView className="px-6 pt-8">
        <View className="space-y-4">
          <TextInput
            className="border border-gray-300 rounded-md p-2 bg-white mb-4"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />

          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              name={patient.name}
              subtext={patient.medicalHistory}
              detail={patient.age + ' años'}
              onPress={() => router.push(`/patients/${patient.id}`)}
            />
          ))}
        </View>

        <View>
          <Pressable
            onPress={() => {
              router.push('/patients/add-patient')
            }}
            className="bg-blue-400  p-4 my-4 rounded-md bg-primary "
          >
            <Text className="text-center text-white text-lg">
              Agregar Paciente
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  )
}

export default Patients
