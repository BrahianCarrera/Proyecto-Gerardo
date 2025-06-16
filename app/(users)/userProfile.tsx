import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import SafeAreaContainer from 'components/safeAreaContainer'
import Header from 'components/Header'
import ProfileImagePicker from 'components/ProfileImagePicker' // Asumo que este es el componente que proporcioné previamente
import { User, useUser } from 'app/context/UserContext'
import { SettingsList } from 'components/SettingsList'
import { Cake, Mail, UserRound } from 'lucide-react-native'
import { getUserInfo } from '../../services/userService'
import { router } from 'expo-router' // Mantengo esta importación por si la usas en otro lugar
import { ScrollView } from 'react-native-gesture-handler'

interface UserDetailsFromAPI {
  id: string
  name: string
  email: string
  birthDate?: string
  role: string
  picture?: string
  createdAt: string
}

const UserProfile = () => {
  const { user, setUser } = useUser()

  const [userDetails, setUserDetails] = useState<UserDetailsFromAPI | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Maneja la actualización de la imagen de perfil.
   * Esta función es llamada por ProfileImagePicker una vez que la imagen se ha subido exitosamente.
   * @param {string} newImageUrl La nueva URL de la imagen de perfil.
   */
  const handleProfileImageUpdate = (newImageUrl: string) => {
    setUserDetails((currentDetails) =>
      currentDetails ? { ...currentDetails, picture: newImageUrl } : null,
    )

    if (user) {
      setUser({
        ...user,
        picture: newImageUrl,
      })
    }
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      // Asegúrate de que user y user.id estén disponibles antes de intentar buscar detalles
      if (user && user.id) {
        try {
          setLoading(true)
          setError(null)

          // Llama al servicio para obtener la información del usuario
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
        // Si no hay usuario o ID, no se puede cargar el perfil
        setLoading(false)
        setError('Usuario no autenticado o ID no disponible.')
      }
    }

    fetchUserDetails()
  }, [user]) // Dependencia en 'user' para re-fetch si el objeto usuario cambia (ej. al loggearse)

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#14798B" />
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

  // Lista de información del usuario para el componente SettingsList
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
      onClick: () => console.log('Go to notifications'), // Mantengo tu onClick original
    },
    // Si deseas mostrar el rol:
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

        <ScrollView className="items-center ">
          <View className="my-5">
            {/* Componente ProfileImagePicker para seleccionar y subir la imagen */}
            <ProfileImagePicker
              userId={user?.id ?? ''} // Pasa el ID del usuario, vacío si no está disponible
              currentProfilePicture={userDetails.picture} // Pasa la URL actual de la imagen
              onProfileUpdateSuccess={handleProfileImageUpdate}
            />
          </View>
          <SettingsList items={info} />
        </ScrollView>
      </View>
    </SafeAreaContainer>
  )
}

export default UserProfile
