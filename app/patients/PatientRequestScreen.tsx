import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import SafeAreaContainer from 'components/safeAreaContainer'
import Header from 'components/Header'
import {
  getCaregiverRequests,
  acceptCaregiverRequest,
  cancelCaregiverRequest,
} from 'services/requestService'
import { useUser } from 'app/context/UserContext'

interface Request {
  id: string // requestId
  caregiverId: string
  caregiverName: string
  patientId: string
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  createdAt: string
}

export default function PatientRequestsScreen() {
  const { user, accessToken } = useUser()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchRequests = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    setRefreshing(true)
    try {
      const data = await getCaregiverRequests()
      console.log(data.filter)
      // Filtra las solicitudes pendientes si el endpoint trae todas
      const pendingRequests = data.filter(
        (req) => req.status.toLowerCase() === 'pending',
      )
      setRequests(pendingRequests)
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'No se pudieron cargar las solicitudes.',
      )
      setRequests([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleAcceptRequest = async (requestId: string) => {
    if (!user?.id) {
      Alert.alert('Error', 'ID de paciente no disponible.')
      return
    }
    Alert.alert(
      'Confirmar Aceptar',
      '¿Estás seguro de que quieres aceptar esta solicitud?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: async () => {
            setLoading(true)
            try {
              await acceptCaregiverRequest({ requestId, patientId: user.id })
              Alert.alert('Éxito', 'Solicitud aceptada correctamente.')
              fetchRequests() // Recargar solicitudes
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.message || 'No se pudo aceptar la solicitud.',
              )
            } finally {
              setLoading(false)
            }
          },
        },
      ],
    )
  }

  const handleRejectRequest = async (requestId: string) => {
    Alert.alert(
      'Confirmar Rechazar',
      '¿Estás seguro de que quieres rechazar esta solicitud?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Rechazar',
          onPress: async () => {
            setLoading(true)
            try {
              await cancelCaregiverRequest(requestId)
              Alert.alert('Éxito', 'Solicitud rechazada correctamente.')
              fetchRequests()
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.message || 'No se pudo rechazar la solicitud.',
              )
            } finally {
              setLoading(false)
            }
          },
        },
      ],
    )
  }

  const renderRequestItem = ({ item }: { item: Request }) => (
    <View className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
      <Text className="text-lg font-semibold text-gray-800 mb-2">
        Solicitud de: {item.caregiverName || 'Cuidador Desconocido'}
      </Text>
      <Text className="text-sm text-gray-600 mb-3">
        Fecha: {new Date(item.createdAt).toLocaleDateString('es-ES')}
      </Text>
      <View className="flex-row justify-around mt-2">
        <TouchableOpacity
          onPress={() => handleAcceptRequest(item.id)}
          className="bg-green-500 py-2 px-4 rounded-lg flex-1 mx-1 items-center"
          disabled={loading}
        >
          <Text className="text-white font-semibold">Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRejectRequest(item.id)}
          className="bg-red-500 py-2 px-4 rounded-lg flex-1 mx-1 items-center"
          disabled={loading}
        >
          <Text className="text-white font-semibold">Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaContainer>
      <Header />
      <View className="flex-1 px-4 pt-8 bg-gray-100">
        <Text className="text-2xl font-bold mb-6 text-center text-gray-800">
          Mis Solicitudes de Cuidador
        </Text>

        {loading && requests.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="mt-4 text-gray-600">Cargando solicitudes...</Text>
          </View>
        ) : requests.length === 0 ? (
          <Text className="text-center text-gray-500 text-base mt-4">
            No tienes solicitudes de cuidador pendientes.
          </Text>
        ) : (
          <FlatList
            data={requests}
            keyExtractor={(item) => item.id}
            renderItem={renderRequestItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            onRefresh={fetchRequests}
            refreshing={refreshing}
          />
        )}
      </View>
    </SafeAreaContainer>
  )
}
