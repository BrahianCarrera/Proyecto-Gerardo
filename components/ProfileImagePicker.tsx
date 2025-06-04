// components/ProfileImagePicker.tsx

import React, { useState, useEffect } from 'react'
import { View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

interface ProfileImagePickerProps {
  userId: string
  imageUrlFromServer?: string
  backendUrl: string
  onImageUploaded?: (url: string) => void
}

const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
  userId,
  imageUrlFromServer,
  backendUrl,
  onImageUploaded,
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null)

  useEffect(() => {
    if (imageUrlFromServer) {
      setImageUri(`${backendUrl}${imageUrlFromServer}`)
    } else {
      fetch(`${backendUrl}/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.imageUrl) {
            setImageUri(`${backendUrl}${data.imageUrl}`)
          }
        })
        .catch(() => {})
    }
  }, [])

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    })

    if (!result.canceled) {
      const image = result.assets[0]
      const formData = new FormData()

      formData.append('image', {
        uri: image.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any)

      formData.append('userId', userId.toString())

      try {
        const res = await fetch(`${backendUrl}/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        const data = await res.json()
        if (data.path) {
          const fullPath = `${backendUrl}${data.path}`
          setImageUri(fullPath)
          onImageUploaded?.(fullPath)
        }
      } catch (err) {
        Alert.alert('Error', 'No se pudo subir la imagen')
      }
    }
  }

  return (
    <TouchableOpacity onPress={pickImage}>
      <Image
        source={
          imageUri
            ? { uri: imageUri }
            : require('../assets/profile-placeholder.png')
        }
        style={styles.avatar}
      />
    </TouchableOpacity>
  )
}

export default ProfileImagePicker

const styles = StyleSheet.create({
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 0,
    borderColor: '#ccc',
  },
})
