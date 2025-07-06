import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import SafeAreaContainer from 'components/safeAreaContainer'
import Header from 'components/Header'
import { sendCaregiverRequest } from 'services/requestService' // Importa la función del servicio
import { useUser } from 'app/context/UserContext' // Asumiendo que tienes este contexto

export default function CaregiverRequestScreen() {
  const { user, accessToken } = useUser() // Para obtener el ID del cuidador si es necesario en el futuro
  const [patientIdentifier, setPatientIdentifier] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendRequest = async () => {
    if (!patientIdentifier.trim()) {
      Alert.alert(
        'Error',
        'Por favor, introduce el identificador (ej. email) del paciente.',
      )
      return
    }

    setLoading(true)
    try {
      // El endpoint solo pide el identificador del paciente
      await sendCaregiverRequest({ identifier: patientIdentifier.trim() })
      Alert.alert('Éxito', `Solicitud enviada a ${patientIdentifier.trim()}.`)
      setPatientIdentifier('') // Limpiar el campo después de enviar
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'No se pudo enviar la solicitud. Intenta de nuevo.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaContainer>
      <Header />
      <ScrollView className="flex-1 px-4 pt-8 bg-gray-100">
        <View className="bg-white p-6 rounded-xl shadow-md">
          <Text className="text-2xl font-bold mb-6 text-center text-gray-800">
            Enviar Solicitud de Vinculación
          </Text>

          <Text className="text-base text-gray-700 mb-2">
            Introduce el email del paciente al que quieres enviar una solicitud:
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-6 bg-white text-base"
            placeholder="Email del paciente"
            keyboardType="email-address"
            autoCapitalize="none"
            value={patientIdentifier}
            onChangeText={setPatientIdentifier}
            editable={!loading}
          />

          <TouchableOpacity
            onPress={handleSendRequest}
            className={`py-3 rounded-lg flex-row justify-center items-center ${
              loading ? 'bg-blue-300' : 'bg-blue-500'
            }`}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-semibold">
                Enviar Solicitud
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaContainer>
  )
}
