import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useCallback, useEffect, useState } from 'react'
import { getPatients } from 'services/patientService'
import PatientCard from 'components/PatientCard'
import { ScrollView, TextInput, View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import SafeAreaContainer from 'components/safeAreaContainer'

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

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useFocusEffect(
    useCallback(() => {
      getPatients().then(setPatients)
    }, []),
  )

  return (
    <SafeAreaContainer>
      <ScrollView className="px-6 pt-8">
        <View className="space-y-4">
          <TextInput
            className="border border-gray-300 rounded-md p-2 bg-white mb-4"
            placeholder="Buscar por nombre o cédula..."
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
      </ScrollView>
    </SafeAreaContainer>
  )
}

export default Patients
