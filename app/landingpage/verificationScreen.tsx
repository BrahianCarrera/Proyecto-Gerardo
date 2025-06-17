// verificationScreen.tsx
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native'
import Logo from '../../assets/logo.svg'
import SafeAreaContainer from 'components/safeAreaContainer'
import Toast from 'react-native-toast-message'
import { router, useLocalSearchParams } from 'expo-router'
import { api } from 'services/api' // Usa tu objeto `api`

import { verifyCode } from 'services/authService'

interface VerificationErrors {
  [key: string]: string
}

export default function CodeVerificationScreen() {
  const { email } = useLocalSearchParams<{ email: string }>()
  const [code, setCode] = useState<string>('')
  const [errors, setErrors] = useState<VerificationErrors>({})
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Error de navegación',
        text2: 'No se pudo obtener el correo para verificación.',
        position: 'bottom',
      })
      router.replace('/landingpage/registerSpecialist')
    }
  }, [email])

  const validateCode = (inputCode: string): VerificationErrors => {
    const newErrors: VerificationErrors = {}
    const regex = /^[0-9]*$/
    if (!inputCode.trim()) {
      newErrors.code = 'El código es obligatorio.'
    } else if (inputCode.trim().length !== 6) {
      newErrors.code = 'El código debe tener 6 caracteres.'
    } else if (regex.test(inputCode) == false) {
      newErrors.code = 'El código debe ser númerico.'
    }
    return newErrors
  }

  const handleVerifyCode = async () => {
    setLoading(true)
    const validationErrors = validateCode(code)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Error de validación',
        text2: 'Por favor, revisa el código ingresado.',
        position: 'bottom',
      })
      setLoading(false)
      return
    }

    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo obtener el correo. Intenta de nuevo.',
        position: 'bottom',
      })
      setLoading(false)
      return
    }

    try {
      const payload = {
        email: email,
        otp: code,
      }

      const response = await api.post('/users/verify-specialist', payload)

      if (response && response.id && response.email && response.role) {
        Toast.show({
          type: 'success',
          text1: 'Verificación exitosa',
          text2: 'Tu cuenta ha sido verificada. ¡Ya puedes iniciar sesión!',
          position: 'bottom',
        })
        router.replace('landingpage/login') // Redirige al usuario a la pantalla de login para que inicie sesión
      } else {
        // Esto se ejecutará si la respuesta no es un objeto de usuario válido,
        // lo que puede indicar un código incorrecto o un error diferente del backend.
        setErrors({
          code: 'El código ingresado es incorrecto o hubo un problema.',
        })
        Toast.show({
          type: 'error',
          text1: 'Verificación fallida',
          text2: 'El código es incorrecto o no se pudo verificar.',
          position: 'bottom',
        })
      }
    } catch (error: any) {
      console.error('Error al verificar el código:', error)
      const errorMessage =
        error.data?.message || 'Ocurrió un problema, intenta de nuevo.'
      Toast.show({
        type: 'error',
        text1: 'Error en la verificación',
        text2: errorMessage,
        position: 'bottom',
      })
      setErrors({ code: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo obtener el correo para reenviar el código.',
        position: 'bottom',
      })
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/resend-otp', { email: email })
      Toast.show({
        type: 'success',
        text1: 'Código reenviado',
        text2: 'Se ha enviado un nuevo código a tu correo.',
        position: 'bottom',
      })
    } catch (error: any) {
      console.error('Error al reenviar código:', error)
      const errorMessage =
        error.data?.message || 'No se pudo reenviar el código.'
      Toast.show({
        type: 'error',
        text1: 'Error al reenviar',
        text2: errorMessage,
        position: 'bottom',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View className="flex-1 bg-primary justify-center items-center px-4">
          <ScrollView
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 my-6 gap-y-6"
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            nestedScrollEnabled={true}
          >
            <View className="items-center gap-y-4">
              <Logo width={120} height={120} />
              <Text className="text-2xl font-bold text-gray-900">
                Verificación de Código
              </Text>
              <Text className="text-gray-600 text-center px-2">
                Hemos enviado un código de verificación a{' '}
                <Text className="font-bold">
                  {email || 'tu correo electrónico'}
                </Text>
                . Por favor, ingrésalo a continuación para continuar.
              </Text>
            </View>

            <View className="mt-4 gap-y-2">
              <Text className="text-sm font-medium text-gray-700">
                Código de Verificación
              </Text>
              <TextInput
                className="h-12 px-4 border border-gray-300 rounded-md text-base text-center tracking-widest"
                placeholder="------"
                keyboardType="number-pad"
                value={code}
                onChangeText={setCode}
                maxLength={6}
              />
              {errors.code && (
                <Text className="text-red-500 text-sm mt-1">{errors.code}</Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleVerifyCode}
              className={`bg-primary rounded-md h-12 justify-center items-center mt-6 ${loading ? 'opacity-70' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-base font-medium text-white">
                  Verificar Código
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleResendCode}
              className="mt-4 items-center"
              disabled={loading}
            >
              <Text className="text-sm text-primary font-medium underline">
                ¿No recibiste el código? Reenviar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  )
}
