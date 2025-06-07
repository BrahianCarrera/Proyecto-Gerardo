import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native'
import { Eye, EyeOff, UsersRound } from 'lucide-react-native'
import { Checkbox, Divider } from 'react-native-paper'
import { Link, router } from 'expo-router'
import Logo from '../../assets/logo.svg'
import SafeAreaContainer from 'components/safeAreaContainer'
import { login } from 'services/loginService'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { useUser } from '../context/UserContext'
import { User } from '../context/UserContext'

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  interface JwtPayload {
    id: string
    email: string
    role: string
  }

  const { user, setUser } = useUser()

  const handleSubmit = async () => {
    const payload = { email, password }

    try {
      const response = await login(payload)
      const token = response.accessToken

      await AsyncStorage.setItem('token', token)

      const decoded = jwtDecode<User>(token)
      setUser(decoded)

      if (user?.role === 'ESPECIALISTA') {
        router.push('/(admin)/patients')
      } else {
        router.push('/(users)/userProfile')
      }
    } catch (error) {
      console.log('Error en login:', error)
      Toast.show({
        type: 'error',
        text1: 'Error al iniciar sesión',
        text2: 'Verifica tus credenciales',
      })
    }
  }

  return (
    <SafeAreaContainer>
      <View className="flex-1 bg-primary justify-center items-center px-4">
        <View className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 gap-y-6">
          <View className="items-center">
            <Logo width={200} height={200} />
          </View>
          <View className="items-center gap-y-2">
            <Text className="text-2xl font-bold text-gray-900">
              Bienvenido a Gerardo
            </Text>
            <Text className="text-gray-600">Iniciar Sesión</Text>
          </View>

          <View className="gap-y-4">
            <View className="gap-y-2">
              <Text className="text-sm font-medium text-gray-700">Correo</Text>
              <TextInput
                className=" px-4 border border-gray-300 rounded-md text-base"
                placeholder="Ingresa tu correo"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="gap-y-2">
              <Text className="text-sm font-medium text-gray-700">
                Contraseña
              </Text>
              <View className="relative">
                <TextInput
                  className=" px-4 pr-12 border border-gray-300 rounded-md text-base"
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
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Checkbox
                  status={rememberMe ? 'checked' : 'unchecked'}
                  onPress={() => setRememberMe(!rememberMe)}
                />
                <Text className="text-sm text-gray-600">Recuerdame</Text>
              </View>
              <Pressable>
                <Text className="text-sm text-primary font-medium">
                  Recuperar contraseña
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={handleSubmit}
              className="bg-primary rounded-md h-12 justify-center items-center"
            >
              <Text className="text-base font-medium text-white">
                Iniciar sesión
              </Text>
            </Pressable>
          </View>

          <View className="items-center">
            <Text className="text-sm text-gray-600">
              No tienes una cuenta?{' '}
              <Link href={'./landingpage/register'} asChild>
                <Text className="text-primary font-medium">Registrate</Text>
              </Link>
            </Text>
          </View>

          <Divider />

          <Link href="./about" asChild>
            <Pressable className="flex-row gap-x-4 justify-center items-center border border-gray-400 rounded-md h-10">
              <Text>Acerca De Nosotros</Text>
              <UsersRound color="#14798B" />
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaContainer>
  )
}
