import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native'
import { Eye, EyeOff, UsersRound } from 'lucide-react-native'
import { Divider } from 'react-native-paper'
import { Link, router } from 'expo-router'
import Logo from '../../assets/logo.svg'
import { api } from 'services/api'
import Toast from 'react-native-toast-message'
import { useUser } from '../context/UserContext'
import { jwtDecode } from 'jwt-decode'

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, loading: authLoading } = useUser()

  const handleSubmit = async () => {
    if (isSubmitting || authLoading) return

    setIsSubmitting(true)
    const payload = { email, password }

    try {
      const response = await api.post('/auth/login', payload)

      const { accessToken, refreshToken } = response

      if (!accessToken || !refreshToken) {
        throw new Error(
          'La respuesta de login no contiene los tokens esperados.',
        )
      }

      await login(accessToken, refreshToken)

      const decodedRole = jwtDecode<{ role: string }>(accessToken).role
      if (decodedRole === 'ESPECIALISTA') {
        router.replace('/(admin)/patients')
      } else {
        router.replace('/(users)/userProfile')
      }
    } catch (error: any) {
      console.log('Error en handleSubmit de LoginScreen:', error)
      const errorMessage =
        error.data?.message || error.message || 'Verifica tus credenciales'
      Toast.show({
        type: 'error',
        text1: 'Error al iniciar sesión',
        text2: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#14798B" />
        <Text className="mt-4 text-gray-700">Cargando sesión...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 bg-primary justify-center items-center p-2">
          <ScrollView
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 flex-1"
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            nestedScrollEnabled={true}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} // Centra el contenido si es pequeño
          >
            <View className="items-center">
              <Logo width={200} height={200} />
            </View>
            <View className="items-center gap-y-2 mt-4">
              <Text className="text-2xl font-bold text-gray-900">
                Bienvenido a Gerardo
              </Text>
              <Text className="text-gray-600">Iniciar Sesión</Text>
            </View>

            <View className="gap-y-4 mt-6">
              <Text className="text-sm font-medium text-gray-700">Correo</Text>
              <TextInput
                className="h-12 px-4 border border-gray-300 rounded-md text-base"
                placeholder="Ingresa tu correo"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
              <Text className="text-sm font-medium text-gray-700 mt-2">
                Contraseña
              </Text>
              <View className="relative">
                <TextInput
                  className="h-12 px-4 pr-12 border border-gray-300 rounded-md text-base"
                  placeholder="Ingresa tu contraseña"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </TouchableOpacity>
              </View>
              <Pressable
                onPress={handleSubmit}
                className="bg-primary rounded-md h-12 justify-center items-center mt-4"
                disabled={isSubmitting} // Deshabilita el botón mientras se envía
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-base font-medium text-white">
                    Iniciar sesión
                  </Text>
                )}
              </Pressable>
            </View>

            <View className="items-center gap-y-2 mt-6">
              <Text className="text-sm text-gray-600">
                No tienes una cuenta?{' '}
                <Link href={'/landingpage/register'} asChild>
                  <Text className="text-primary font-medium">Regístrate</Text>
                </Link>
              </Text>

              <Text className="text-sm text-gray-600">
                Si eres especialista de la salud
              </Text>
              <Link href={'/landingpage/registerSpecialist'} asChild>
                <Text className="text-primary text-sm font-medium">
                  Regístrate Aquí
                </Text>
              </Link>
            </View>
            <Divider className="my-6" />
            <Link href="/landingpage/about" asChild>
              <Pressable className="flex-row gap-x-4 justify-center items-center border border-gray-400 rounded-md h-10 mb-4">
                <Text>Acerca De Nosotros</Text>
                <UsersRound color="#14798B" />
              </Pressable>
            </Link>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
