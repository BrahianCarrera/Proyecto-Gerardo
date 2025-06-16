import React, { useState } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { updatePhoto } from '../services/userService' // asegúrate que el path es correcto

interface Props {
  userId: string
  currentProfilePicture?: string
  onProfileUpdateSuccess?: (newImageUrl: string) => void
}

const ProfileImagePicker = ({
  userId,
  currentProfilePicture,
  onProfileUpdateSuccess,
}: Props) => {
  const [image, setImage] = useState(currentProfilePicture)
  const [uploading, setUploading] = useState(false)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1], // cuadrado
      quality: 1,
    })

    if (!result.canceled && result.assets.length > 0) {
      const selected = result.assets[0]

      try {
        setUploading(true)

        const response = await updatePhoto(selected.uri, userId)

        if (response.picture) {
          setImage(response.picture)
          onProfileUpdateSuccess?.(response.picture)
        } else {
          Alert.alert('Error', 'No se pudo actualizar la foto de perfil')
        }
      } catch (err) {
        console.error('Error al subir imagen:', err)
        Alert.alert('Error', 'No se pudo subir la imagen. Revisa la consola.')
      } finally {
        setUploading(false)
      }
    }
  }

  return (
    <View className="items-center">
      <TouchableOpacity onPress={pickImage} disabled={uploading}>
        <View className="w-48 h-48 rounded-full overflow-hidden border-2 border-gray-300">
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 justify-center items-center bg-gray-200">
              <Text>Seleccionar Foto</Text>
            </View>
          )}
          {uploading && (
            <View className="absolute inset-0 bg-white bg-opacity-70 justify-center items-center">
              <ActivityIndicator size="large" color="#14798B" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default ProfileImagePicker
