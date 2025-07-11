import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput, // No se usa en este componente, pero estaba en el original
  Button, // No se usa en este componente, pero estaba en el original
} from 'react-native'
import { useEffect, useState } from 'react'
import Header from 'components/Header'
import SafeAreaContainer from 'components/safeAreaContainer'
import { useUser } from 'app/context/UserContext'
import { getAlarmsByPatient } from 'services/alarmService' // Esta función trae las alarmas, que son tus medicinas
import Toast from 'react-native-toast-message'
import { HelpCircle } from 'lucide-react-native'
import MedicineReminderCard from 'components/MedCard'
import { Picker } from '@react-native-picker/picker' // Importar el Picker
import { getCaregiverPatients } from 'services/patientService' // Importar el servicio para obtener pacientes

// Definiciones de interfaces (asegúrate de que estas estén disponibles globalmente o definidas aquí)
interface Medicine {
  id: string
  name: string
  time: string
  type: string // "MEDICAMENTO" o "SUPLEMENTO"
  daysOfWeek: number[]
  isTaken: boolean
}

// Interfaz para la lista de pacientes del cuidador
interface PatientListItem {
  name: string
  id: string
}

const MedicineTracking = () => {
  const { user } = useUser()

  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDayMedicines, setCurrentDayMedicines] = useState<Medicine[]>([])
  const [currentDayName, setCurrentDayName] = useState<string>('')

  // NUEVOS ESTADOS para el cuidador
  const [patients, setPatients] = useState<PatientListItem[]>([])
  const [caregiverPatientId, setCaregiverPatientId] = useState<string>('')
  const [displayPatientId, setDisplayPatientId] = useState<string | null>(null) // ID del paciente cuya dieta/medicamentos se está mostrando

  const daysMap: { [key: number]: string } = {
    0: 'Domingo',
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
  }

  // Función para cargar las medicinas de un paciente dado su ID
  const loadMedicinesForPatient = async (patientIdToFetch: string) => {
    setLoading(true)
    setError(null)
    setMedicines([]) // Limpia las medicinas actuales
    setCurrentDayMedicines([]) // Limpia las medicinas del día actual

    try {
      const result: Medicine[] = await getAlarmsByPatient(patientIdToFetch) // Obtener alarmas (medicinas)
      // Filtra solo las de tipo "MEDICAMENTO" si es necesario, o usa todas las alarmas
      const medicalAlarms = result.filter(
        (alarm) => alarm.type === 'MEDICAMENTO' || alarm.type === 'SUPLEMENTO',
      ) // Asegúrate de que los tipos coincidan con tu backend
      setMedicines(medicalAlarms.map((med) => ({ ...med, isTaken: false }))) // Inicializar isTaken a false
      setDisplayPatientId(patientIdToFetch) // Establece el ID del paciente que se está mostrando
    } catch (err) {
      console.error('Error al cargar las medicinas:', err)
      setError('Error al cargar las medicinas. Verifique el ID del paciente.')
      setDisplayPatientId(null) // Restablece si hay un error
    } finally {
      setLoading(false)
    }
  }

  // useEffect principal para cargar datos iniciales y pacientes para cuidador
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false)
        setError('ID de usuario no disponible.')
        return
      }

      if (user.role === 'PACIENTE') {
        // Si es paciente, carga sus propias medicinas
        loadMedicinesForPatient(user.id)
      } else if (user.role === 'CUIDADOR') {
        // Si es cuidador, carga la lista de pacientes a su cargo
        try {
          const fetchedPatients = await getCaregiverPatients(user.id)
          setPatients(fetchedPatients)
          // Si el cuidador no ha seleccionado un paciente, mantén el estado de carga como falso
          // y muestra un mensaje para que seleccione uno.
          if (!caregiverPatientId) {
            setLoading(false)
            setError(
              'Seleccione un paciente para ver su historial de medicinas.',
            )
          } else {
            // Si ya había un paciente seleccionado (ej. al volver a la pantalla)
            loadMedicinesForPatient(caregiverPatientId)
          }
        } catch (err) {
          console.error('Error al cargar pacientes para el cuidador:', err)
          setError('Error al cargar la lista de pacientes.')
          setLoading(false)
        }
      }
    }
    fetchData()
  }, [user]) // Depende de la información del usuario

  // useEffect para filtrar medicinas del día actual cada vez que 'medicines' cambia
  useEffect(() => {
    if (medicines.length > 0) {
      const today = new Date().getDay()
      setCurrentDayName(daysMap[today])

      const filtered = medicines.filter((med) => med.daysOfWeek.includes(today))
      // Ordenar por hora
      filtered.sort((a, b) => {
        const timeA = parseInt(a.time.replace(':', ''))
        const timeB = parseInt(b.time.replace(':', ''))
        return timeA - timeB
      })
      setCurrentDayMedicines(filtered)
    } else {
      setCurrentDayMedicines([]) // Limpiar si no hay medicinas
    }
  }, [medicines]) // Este hook ahora depende de 'medicines'

  const handlePress = (medicineId: string) => {
    const med = medicines.find((m) => m.id === medicineId)
    if (!med) return

    const currentTaken = med.isTaken

    // La lógica de autorización ahora usa displayPatientId
    if (
      user?.role === 'PACIENTE' ||
      (user?.role === 'CUIDADOR' && displayPatientId)
    ) {
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
    } else {
      Toast.show({
        type: 'info',
        text1:
          'Solo los pacientes o cuidadores con un paciente cargado pueden registrar el consumo.',
      })
    }
  }

  const updateMedicineStatus = async (
    medicineId: string,
    currentTaken: boolean,
  ) => {
    const updated = medicines.map((m) =>
      m.id === medicineId ? { ...m, isTaken: !currentTaken } : m,
    )
    setMedicines(updated) // Actualiza la lista completa de medicinas
    // El useEffect dependiente de 'medicines' se encargará de actualizar 'currentDayMedicines'

    try {
      // Determina el patientId correcto para el log (paciente o el paciente del cuidador)
      const idToLog = user?.role === 'PACIENTE' ? user.id : displayPatientId
      if (!idToLog) {
        throw new Error('No hay ID de paciente para registrar el medicamento.')
      }

      // Descomenta y ajusta esta llamada una vez que tengas la función `logMedicine`
      /*
      await logMedicine({ patientId: idToLog, medicineId: medicineId });
      Toast.show({
        type: 'success',
        text1: 'Estado de medicina actualizado',
      });
      */
      Toast.show({
        type: 'info',
        text1: 'Simulación: Estado de medicina actualizado', // Mensaje temporal si logMedicine está comentado
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
      setMedicines(reverted) // Revierte la lista completa de medicinas
      // El useEffect dependiente de 'medicines' se encargará de revertir 'currentDayMedicines'
    }
  }

  // --- Renderizado ---

  // Estado de carga inicial (para paciente o lista de pacientes del cuidador)
  if (
    loading &&
    (!user ||
      (user.role === 'CUIDADOR' &&
        patients.length === 0 &&
        !caregiverPatientId))
  ) {
    return (
      <SafeAreaContainer>
        <Header />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#14798B" />
          <Text className="mt-2 text-base text-gray-700">
            {user?.role === 'PACIENTE'
              ? 'Cargando tus medicinas...'
              : 'Cargando pacientes...'}
          </Text>
        </View>
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer>
      <Header />

      {/* Picker para el rol de CUIDADOR */}
      {user?.role === 'CUIDADOR' && (
        <View className="p-4 bg-gray-100 border-b border-gray-200">
          <Text className="text-lg font-bold mb-2">
            Ver Medicinas de Paciente
          </Text>

          <View className="border rounded-xl border-gray-300 bg-white">
            <Picker
              selectedValue={caregiverPatientId}
              onValueChange={(itemValue: string) => {
                setCaregiverPatientId(itemValue)
                if (itemValue) {
                  loadMedicinesForPatient(itemValue)
                }
              }}
            >
              <Picker.Item
                label="Seleccione un paciente..."
                value=""
                enabled={false}
              />
              {patients.map((patient) => (
                <Picker.Item
                  key={patient.id}
                  label={`${patient.name} (ID: ${patient.id})`}
                  value={patient.id}
                />
              ))}
            </Picker>
          </View>
          {displayPatientId && (
            <Text className="mt-2 text-sm text-gray-600">
              Mostrando medicinas para: {displayPatientId}
            </Text>
          )}
        </View>
      )}

      {/* Indicador de carga cuando se está cargando la dieta de un paciente específico */}
      {loading && user?.role === 'CUIDADOR' && displayPatientId && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#14798B" />
          <Text className="mt-2 text-base text-gray-700">
            Cargando medicinas para el paciente {displayPatientId}...
          </Text>
        </View>
      )}

      {/* Manejo de errores */}
      {error && !loading && (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-600 text-lg text-center">{error}</Text>
        </View>
      )}

      {/* Contenido principal: listado de medicinas */}
      {!loading &&
        !error &&
        medicines.length > 0 && ( // Solo muestra si no está cargando, no hay error y hay medicinas cargadas
          <ScrollView className="p-2">
            <View className="mb-4">
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
                      times={[med.time]} // asumiendo que times es un array
                      isTaken={med.isTaken}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <View className="bg-white rounded-xl p-4 shadow-md items-center justify-center">
                  <Text className="text-lg text-gray-600">
                    No hay medicinas programadas para hoy para este paciente.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}

      {/* Mensaje cuando no hay medicinas y no hay error */}
      {!loading && medicines.length === 0 && !error && (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-gray-600 text-lg text-center">
            {user?.role === 'PACIENTE'
              ? 'No hay medicinas programadas para ti.'
              : displayPatientId
                ? 'No hay medicinas para este paciente o no están programadas.'
                : 'Seleccione un paciente para ver sus medicinas.'}
          </Text>
        </View>
      )}

      <Toast />
    </SafeAreaContainer>
  )
}

export default MedicineTracking
