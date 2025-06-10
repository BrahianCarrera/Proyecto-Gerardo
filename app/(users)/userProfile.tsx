import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import SafeAreaContainer from 'components/safeAreaContainer'
import Header from 'components/Header'
import ProfileImagePicker from 'components/ProfileImagePicker'
import { useUser } from 'app/context/UserContext'
import { SettingsList } from 'components/SettingsList'
import { Cake, Mail, UserRound } from 'lucide-react-native'
import { getUserInfo } from '../../services/userService'
import { router } from 'expo-router'

interface UserDetailsFromAPI {
  id: string
  name: string
  email: string
  birthDate?: string
  role: string
  picture?: string | null
  createdAt: string
}

const UserProfile = () => {
  const { user } = useUser()

  const [userDetails, setUserDetails] = useState<UserDetailsFromAPI | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  if (!user?.id) {
    router.replace('/login')
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No autenticado. Redirigiendo...</Text>
      </View>
    )
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && user.id) {
        try {
          setLoading(true)
          setError(null)

          const data = await getUserInfo(user.id)

          if (data) {
            setUserDetails(data)
          } else {
            setError('No se encontraron los detalles del usuario.')
          }
        } catch (err) {
          console.error('Error al obtener los detalles del usuario:', err)
          setError('Error al cargar los detalles del usuario.')
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
        setError('Usuario no autenticado o ID no disponible.')
      }
    }

    fetchUserDetails()
  }, [user])

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#14798B" />{' '}
        <Text>Cargando perfil del usuario...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    )
  }

  if (!userDetails) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>
          No hay datos de usuario disponibles. Intenta de nuevo más tarde.
        </Text>
      </View>
    )
  }

  const info = [
    {
      icon: <UserRound size={40} color="#14798B" />,
      title: 'Nombre',
      subtitle: userDetails.name,
    },
    {
      icon: <Mail size={40} color="#14798B" />,
      title: 'Correo',
      subtitle: userDetails.email,
    },
    {
      icon: <Cake size={40} color="#14798B" />,
      title: 'Cumpleaños',

      subtitle: userDetails.birthDate
        ? new Date(userDetails.birthDate).toLocaleDateString('es-ES')
        : 'No especificado',
      onClick: () => console.log('Go to notifications'),
    },
    // Puedes agregar más elementos usando otras propiedades de userDetails
    // {
    //   icon: <UserRound size={40} color="#14798B" />,
    //   title: 'Rol',
    //   subtitle: userDetails.role,
    // },
  ]

  return (
    <SafeAreaContainer>
      <Header />
      <View className="p-4">
        <Text className="text-xl text-gray-600">Bienvenido</Text>

        <Text className="font-bold text-2xl text-gray-700">
          {userDetails.name}
        </Text>

        <View className="items-center ">
          <View className="my-10">
            <ProfileImagePicker
              userId={user.id} // Aquí sigues usando user.id del contexto
              backendUrl={'localhost:4000'}
              // Puedes pasar userDetails.picture si lo tienes y lo necesitas
              // currentImage={userDetails.picture}
            />
          </View>
          <SettingsList items={info} />
        </View>
      </View>
    </SafeAreaContainer>
  )
}

export default UserProfile
