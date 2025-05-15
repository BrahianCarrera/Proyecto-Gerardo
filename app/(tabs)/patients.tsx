import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import { getPatients } from 'services/patientService'
import PatientCard from 'components/PatientCard'
import { ScrollView, TextInput, View, Text } from 'react-native'

const Patients = () => {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    getPatients()
      .then(setPatients)
      .catch((err) => console.error('Error cargando pacientes', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <SafeAreaView>
      <ScrollView className="px-6">
        <View className="space-y-4">
          <Text className="text-lg font-bold">Pacientes</Text>

          <TextInput
            className="border border-gray-300 rounded-md p-2"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />

          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              name={patient.name}
              diagnosis={patient.medicalHistory}
              age={patient.age}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Patients
