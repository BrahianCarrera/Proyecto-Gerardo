import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import SafeAreaContainer from 'components/safeAreaContainer'
import Header from 'components/Header'
import ProfileImagePicker from 'components/ProfileImagePicker'
import { useUser } from 'app/context/UserContext'
import { SettingsList } from 'components/SettingsList'
import { Cake, Mail, UserRound } from 'lucide-react-native'
import { getUserInfo } from '../../services/userService'
import { Pressable, ScrollView } from 'react-native-gesture-handler' // If you need specific gesture handling, otherwise use 'react-native' ScrollView

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
  const { user, logout } = useUser() // Assuming signOut is available from your UserContext

  const [userDetails, setUserDetails] = useState<UserDetailsFromAPI | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleProfileImageUpdate = (newImageUrl: string) => {
    setUserDetails((currentDetails) =>
      currentDetails ? { ...currentDetails, picture: newImageUrl } : null,
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

  // --- Loading, error, and no user data states ---
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#14798B" />
        <Text className="mt-4 text-gray-600">
          Cargando perfil del usuario...
        </Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500 text-base">{error}</Text>
      </View>
    )
  }

  if (!userDetails) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600 text-base">
          No hay datos de usuario disponibles. Intenta de nuevo más tarde.
        </Text>
      </View>
    )
  }

  // --- Data for SettingsList ---
  const info = [
    {
      icon: <UserRound size={24} color="#14798B" />,
      title: 'Nombre',
      subtitle: userDetails.name,
    },
    {
      icon: <Mail size={24} color="#14798B" />,
      title: 'Correo',
      subtitle: userDetails.email,
    },
    {
      icon: <Cake size={24} color="#14798B" />,
      title: 'Cumpleaños',
      subtitle: userDetails.birthDate
        ? new Date(userDetails.birthDate).toLocaleDateString('es-ES')
        : 'No especificado',
    },
    // Add more info here if needed, e.g., role
    // {
    //   icon: <Briefcase size={24} color="#14798B" />,
    //   title: 'Rol',
    //   subtitle: userDetails.role,
    // }
  ]

  return (
    <SafeAreaContainer>
      <Header />
      <ScrollView
        // Apply consistent horizontal padding to the content within ScrollView
        className="flex-grow pb-8 px-4 bg-gray-100" // Increased padding-bottom for scrollable content
        showsVerticalScrollIndicator={false} // Hide scroll indicator for a cleaner look
      >
        {/* Welcome Section */}
        <View className="pt-6 mb-4">
          <Text className="text-lg text-gray-600">Bienvenido</Text>
          <Text className="font-bold text-2xl text-gray-700">
            {userDetails.name}
          </Text>
        </View>

        {/* Profile Image Picker */}
        <View className="items-center my-8">
          <ProfileImagePicker
            userId={user?.id ?? ''}
            currentProfilePicture={userDetails.picture}
            onProfileUpdateSuccess={handleProfileImageUpdate}
          />
        </View>

        {/* User Details / Settings List */}
        <View className=" mb-6">
          <SettingsList items={info} />
        </View>

        {/* Logout Button */}
        <View className="w-full items-center mb-8">
          <Pressable
            onPress={logout}
            className="bg-red-500 rounded-xl py-4 w-11/12 items-center justify-center shadow-md active:opacity-80"
          >
            <Text className="text-white font-bold text-lg">Cerrar Sesión</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaContainer>
  )
}

export default UserProfile
