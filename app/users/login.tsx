import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native'
import { Eye, EyeOff } from 'lucide-react-native'
import { Checkbox } from 'react-native-paper'
import { Link } from 'expo-router'
import { linkTo } from 'expo-router/build/global-state/routing'

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = () => {
    Alert.alert(
      'Login attempt',
      JSON.stringify({ email, password, rememberMe }),
    )
  }

  return (
    <View className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 justify-center items-center px-4">
      <View className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <View className="items-center space-y-2">
          <View className="w-16 h-16 bg-primary rounded-full justify-center items-center"></View>
          <Text className="text-2xl font-bold text-gray-900">Bienvenido</Text>
          <Text className="text-gray-600">Inicia Sesión</Text>
        </View>

        <View className="space-y-4">
          <View className="space-y-2">
            <Text className="text-sm font-medium text-gray-700">Correo</Text>
            <TextInput
              className="h-12 px-4 border border-gray-300 rounded-md text-base"
              placeholder="Ingresa tu correo"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="space-y-2">
            <Text className="text-sm font-medium text-gray-700">
              Contraseña
            </Text>
            <View className="relative">
              <TextInput
                className="h-12 px-4 pr-12 border border-gray-300 rounded-md text-base"
                placeholder="Ingresa tu constraseña"
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
            <Link href={'./register'} asChild>
              <Pressable>
                <Text className="text-primary font-medium">Registrate</Text>
              </Pressable>
            </Link>
          </Text>
        </View>
      </View>
    </View>
  )
}
