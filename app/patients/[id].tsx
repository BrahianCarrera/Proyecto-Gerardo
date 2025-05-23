import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  getPatientById,
  updatePatient,
  assignDietToPatientData,
} from 'services/patientService'

import { getDiets } from 'services/dietService'

interface DietType {
  id: string
  name: string
  description: string
  observations: string
}

export default function PatientDetail() {
  const { id } = useLocalSearchParams()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [diets, setDiets] = useState<DietType[]>([])
  const [isAssigningDiet, setIsAssigningDiet] = useState(false)
  const [selectedDiet, setSelectedDiet] = useState('')

  const [patient, setPatient] = useState({
    name: '',
    age: '',
    diagnosis: '',
    eatingHabits: '',
    diet: {
      id: '',
      name: '',
      description: '',
      observations: '',
    },
  })

  useEffect(() => {
    if (typeof id === 'string') {
      getPatientById(id)
        .then((data) => {
          setPatient({
            name: data.name || '',
            age: data.age?.toString() || '',
            diagnosis: data.medicalHistory || '',
            eatingHabits: data.eatingHabits || '',
            diet: data.diet
              ? {
                  id: data.diet.id || '',
                  name: data.diet.name || '',
                  description: data.diet.description || '',
                  observations: data.diet.observations || '',
                }
              : {
                  id: '',
                  name: '',
                  description: '',
                  observations: '',
                },
          })
        })
        .catch((err) => console.error('Error cargando paciente', err))
        .finally(() => setLoading(false))
    }
  }, [id])

  useEffect(() => {
    getDiets()
      .then((data) => setDiets(data))
      .catch((err) => console.error('Error cargando dietas', err))
  }, [])

  const handleSave = async () => {
    try {
      if (typeof id === 'string') {
        await updatePatient({
          patientId: id,
          name: patient.name,
          age: Number(patient.age),
          medicalHistory: patient.diagnosis,
          eatingHabits: patient.eatingHabits,
        })
        setIsEditing(false)
      } else {
        console.error('ID de paciente inválido:', id)
      }
    } catch (error) {
      console.error('Error al guardar cambios:', error)
    }
  }

  const handleDeleteDiet = async () => {
    try {
      if (typeof id === 'string') {
        await assignDietToPatientData({
          patientId: id,
          dietId: null,
        })

        setPatient((prev) => ({
          ...prev,
          diet: {
            id: '',
            name: '',
            description: '',
            observations: '',
          },
        }))
      } else {
        console.error('ID de paciente inválido:', id)
      }
    } catch (error) {
      console.error('Error al eliminar la dieta:', error)
    }
  }

  const handleDietAssign = async () => {
    try {
      await assignDietToPatientData({
        patientId: id,
        dietId: selectedDiet,
      })
      const newlyAssignedDiet = diets.find((d) => d.id === selectedDiet)

      if (newlyAssignedDiet) {
        setPatient((prev) => ({
          ...prev,
          diet: newlyAssignedDiet,
        }))
      }
      setIsAssigningDiet(false)
    } catch (error) {
      console.error('error al asignar esta dieta', error)
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-2 text-gray-600">Cargando paciente...</Text>
      </View>
    )
  }
  return (
    <View className="flex-1 relative">
      <ScrollView className="p-6">
        <View className="border border-gray-300 p-4 rounded-md shadow space-y-4 mb-2">
          <Text className="text-xl font-bold text-center mb-6">
            Información General
          </Text>
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
              {isEditing ? (
                <>
                  <TextInput
                    className="border p-2 mb-2"
                    value={patient.name}
                    onChangeText={(text) =>
                      setPatient({ ...patient, name: text })
                    }
                  />
                  <TextInput
                    className="border p-2 mb-2"
                    value={patient.age}
                    onChangeText={(text) =>
                      setPatient({ ...patient, age: text })
                    }
                  />
                  <TextInput
                    className="border p-2 mb-2"
                    value={patient.diagnosis}
                    onChangeText={(text) =>
                      setPatient({ ...patient, diagnosis: text })
                    }
                  />
                  <TextInput
                    className="border p-2 mb-2"
                    value={patient.eatingHabits}
                    onChangeText={(text) =>
                      setPatient({ ...patient, eatingHabits: text })
                    }
                  />
                </>
              ) : (
                <>
                  <Text className="text-base mb-2 break-words">119307921</Text>
                  <Text className="text-base mb-2 break-words">
                    {patient.name}
                  </Text>
                  <Text className="text-base mb-2">{patient.age} años</Text>
                  <Text className="text-base mb-2 break-words">
                    {patient.diagnosis}
                  </Text>
                  <Text className="text-base mb-2 break-words">
                    {patient.eatingHabits}
                  </Text>
                </>
              )}
            </View>
          </View>

          <View className="items-center mt-4">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={isEditing ? handleSave : () => setIsEditing(true)}
              className="bg-blue-500 rounded-lg py-2 px-6"
            >
              <Text className="text-white font-bold text-base">
                {isEditing ? 'Guardar' : 'Editar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="border border-gray-300 p-4 rounded-md shadow space-y-4">
          <Text className="text-xl font-bold text-center mb-6">
            Dieta Asignadas
          </Text>

          {isAssigningDiet ? (
            <View className="border border-gray-300 rounded-md overflow-hidden bg-white">
              <Picker
                className="h-10 px-2"
                selectedValue={selectedDiet}
                onValueChange={(itemValue) => setSelectedDiet(itemValue)}
                dropdownIconColor="#4F46E5"
              >
                <Picker.Item
                  label="Selecciona un tipo..."
                  value=""
                  enabled={false}
                />
                {diets.map((diet) => (
                  <Picker.Item
                    key={diet.id}
                    label={diet.name}
                    value={diet.id}
                  />
                ))}
              </Picker>
            </View>
          ) : (
            <></>
          )}

          <Text className="text-base font-bold mb-2">{patient.diet.name}</Text>
          <View className="flex-row space-x-4 justify-center">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={
                isAssigningDiet
                  ? handleDietAssign
                  : () => setIsAssigningDiet(true)
              }
              className="bg-green-500 rounded-lg px-6 py-2 items-center justify-center w-32"
            >
              <Text className="text-white font-bold text-base text-center">
                {isAssigningDiet ? 'Guardar' : 'Asignar'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsModalVisible(true)}
              className="bg-red-500 rounded-lg px-6 py-2 items-center justify-center w-32"
            >
              <Text className="text-white font-bold text-base text-center">
                Eliminar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {isModalVisible && (
        <View className="absolute inset-0 z-50 bg-black/50 items-center justify-center">
          <View className="bg-white w-4/5 p-6 rounded-xl shadow-lg">
            <Text className="text-lg font-bold text-center mb-4">
              ¿Estás seguro de que quieres eliminar esta dieta?
            </Text>

            <View className="flex-row justify-around mt-2">
              <TouchableOpacity
                onPress={() => {
                  handleDeleteDiet()
                  setIsModalVisible(false)
                }}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-bold">Eliminar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                <Text className="text-gray-800 font-bold">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
