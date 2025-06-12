import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native'
import { useEffect, useState } from 'react'
import Header from 'components/Header'
import SafeAreaContainer from 'components/safeAreaContainer'
import { useUser } from 'app/context/UserContext'
import { getAlarmsByPatient } from 'services/alarmService'
import Toast from 'react-native-toast-message'
import { HelpCircle } from 'lucide-react-native'
import MedicineReminderCard from 'components/MedCard'

interface Medicine {
  id: string
  name: string
  time: string
  type: string
  daysOfWeek: number[]
  isTaken: boolean
}

const MedicineTracking = () => {
  const { user } = useUser()

  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDayMedicines, setCurrentDayMedicines] = useState<Medicine[]>([])
  const [currentDayName, setCurrentDayName] = useState<string>('')

  const daysMap: { [key: number]: string } = {
    0: 'Domingo',
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
  }

  useEffect(() => {
    const fetchMedicines = async () => {
      if (!user?.id) {
        setError('ID de usuario no disponible.')
        setLoading(false)
        return
      }

      try {
        const result = await getAlarmsByPatient(user.id)
        setMedicines(result)
      } catch (err) {
        console.error(err)
        setError('Error al cargar las medicinas.')
      } finally {
        setLoading(false)
      }
    }

    fetchMedicines()
  }, [user])

  useEffect(() => {
    if (medicines.length > 0) {
      const today = new Date().getDay()
      setCurrentDayName(daysMap[today])

      const filtered = medicines.filter((med) => med.daysOfWeek.includes(today))
      setCurrentDayMedicines(filtered)
    }
  }, [medicines])

  const handlePress = (medicineId: string) => {
    const med = medicines.find((m) => m.id === medicineId)
    if (!med) return

    const currentTaken = med.isTaken

    Alert.alert(
      currentTaken ? '¿Desmarcar como tomada?' : '¿Marcar como tomada?',
      `¿Seguro que quieres ${
        currentTaken ? 'desmarcar' : 'marcar'
      } "${med.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => updateMedicineStatus(med.id, currentTaken),
        },
      ],
    )
  }

  const updateMedicineStatus = async (
    medicineId: string,
    currentTaken: boolean,
  ) => {
    const updated = medicines.map((m) =>
      m.id === medicineId ? { ...m, isTaken: !currentTaken } : m,
    )
    setMedicines(updated)
    // Actualizar también la lista de medicinas del día actual si cambia el estado
    setCurrentDayMedicines((prev) =>
      prev.map((m) =>
        m.id === medicineId ? { ...m, isTaken: !currentTaken } : m,
      ),
    )

    /*try {
      await logMedicine({ patientId: user?.id, medicineId })
      Toast.show({
        type: 'success',
        text1: 'Estado de medicina actualizado',
      })
    } catch (err) {
      console.error(err)
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar estado',
      })
      const reverted = medicines.map((m) =>
        m.id === medicineId ? { ...m, isTaken: currentTaken } : m,
      )
      setMedicines(reverted)
      // También revertir el estado de la lista del día actual
      setCurrentDayMedicines(prev => prev.map(m =>
        m.id === medicineId ? { ...m, isTaken: currentTaken } : m
      ));
    }
  */
  }

  if (loading) {
    return (
      <SafeAreaContainer>
        <Header />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#14798B" />
          <Text className="mt-2 text-base text-gray-700">
            Cargando tus medicinas...
          </Text>
        </View>
      </SafeAreaContainer>
    )
  }

  if (error) {
    return (
      <SafeAreaContainer>
        <Header />
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-600 text-lg text-center">{error}</Text>
        </View>
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer>
      <Header />

      <ScrollView className="p-2">
        <View className="mb-4">
          {/* Mostramos el día actual */}
          <View className="rounded-xl bg-purple-100 p-2 mb-4">
            <Text className="text-2xl font-bold text-gray-800 capitalize text-center">
              Medicinas para hoy: {currentDayName}
            </Text>
          </View>

          {currentDayMedicines.length > 0 ? (
            currentDayMedicines.map((med) => (
              <TouchableOpacity
                key={med.id}
                onPress={() => handlePress(med.id)}
              >
                <MedicineReminderCard
                  name={med.name}
                  times={[med.time]} // Pasamos la hora como un arreglo para que coincida con el prop 'times'
                  isTaken={med.isTaken} // Pasamos el estado de 'isTaken'
                />
              </TouchableOpacity>
            ))
          ) : (
            <View className="bg-white rounded-xl p-4 shadow-md items-center justify-center">
              <Text className="text-lg text-gray-600">
                No hay medicinas programadas para hoy.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaContainer>
  )
}

export default MedicineTracking
