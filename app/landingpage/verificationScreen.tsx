import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import Logo from '../../assets/logo.svg' // Asegúrate de que esta ruta sea correcta
import SafeAreaContainer from 'components/safeAreaContainer' // Asegúrate de que esta ruta sea correcta
import Toast from 'react-native-toast-message'
import { router } from 'expo-router' // Para la navegación
import { useUser } from 'app/context/UserContext'
import { verifyCode } from 'services/authService'

interface VerificationForm {
  email: string
  code: string
}

interface VerificationErrors {
  [key: string]: string
}

export default function CodeVerificationScreen() {
  const [code, setCode] = useState<string>('')
  const [errors, setErrors] = useState<VerificationErrors>({})
  const [loading, setLoading] = useState<boolean>(false)
  const { user } = useUser()

  // Función para validar el código (puedes añadir tu lógica de validación real aquí)
  const validateCode = (inputCode: string): VerificationErrors => {
    const newErrors: VerificationErrors = {}
    const regex = /^[0-9]*$/
    if (!inputCode.trim()) {
      newErrors.code = 'El código es obligatorio.'
    } else if (inputCode.trim().length !== 6) {
      newErrors.code = 'El código debe tener 6 caracteres.'
    } else if (regex.test(inputCode) == false) {
      newErrors.code = ' El código debe ser númerico'
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

    try {
      const payload = {
        email: user?.email,
        opt: code,
      }
      const response = await verifyCode(payload)

      if (response && response.accessToken) {
        Toast.show({
          type: 'success',
          text1: 'Verificación exitosa',
          text2: 'Tu cuenta ha sido verificada.',
          position: 'bottom',
        })
        // Redirige al usuario a la siguiente pantalla (ej. inicio de sesión o perfil)
        router.push('/login')
      } else {
        setErrors({ code: 'El código ingresado es incorrecto.' })
        Toast.show({
          type: 'error',
          text1: 'Código incorrecto',
          text2: 'Por favor, intenta de nuevo.',
          position: 'bottom',
        })
      }
    } catch (error) {
      console.error('Error al verificar el código:', error)
      Toast.show({
        type: 'error',
        text1: 'Error en la verificación',
        text2: 'Ocurrió un problema, intenta de nuevo.',
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
                Hemos enviado un código de verificación a tu correo electrónico.
                Por favor, ingrésalo a continuación para continuar.
              </Text>
            </View>

            {/* Campo para el código */}
            <View className="mt-4 gap-y-2">
              <Text className="text-sm font-medium text-gray-700">
                Código de Verificación
              </Text>
              <TextInput
                className="h-12 px-4 border border-gray-300 rounded-md text-base text-center tracking-widest"
                placeholder="------" // Placeholder para indicar la longitud
                keyboardType="number-pad" // Solo números
                value={code}
                onChangeText={setCode}
                maxLength={6} // Limita la entrada a 6 caracteres
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
              <Text className="text-base font-medium text-white">
                {loading ? 'Verificando...' : 'Verificar Código'}
              </Text>
            </TouchableOpacity>

            {/* Opción para reenviar el código */}
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Reenviar Código',
                  'El código ha sido reenviado a tu correo.',
                )
              }
              className="mt-4 items-center"
              disabled={loading}
            >
              <Text className="text-sm text-primary font-medium underline">
                ¿No recibiste el código? Reenviar
              </Text>
            </TouchableOpacity>

            <Toast />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  )
}
