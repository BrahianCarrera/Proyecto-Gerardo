import { View, Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import SafeAreaContainer from 'components/safeAreaContainer'
import Logo from '../../assets/logo.svg'
import { Divider } from 'react-native-paper'
import { UsersRound, ShieldCheck, Zap, ArrowBigLeft } from 'lucide-react-native'
import { useRouter } from 'expo-router'
const About = () => {
  const router = useRouter()

  return (
    <SafeAreaContainer>
      <View className="flex-1 bg-primary  justify-center items-center px-4">
        <ScrollView className="w-full m-4 bg-white rounded-2xl shadow-xl p-6 gap-y-6">
          <View className="flex-1 justify-center items-center gap-y-4">
            <Logo width={120} height={120} />
            <Text className="text-3xl font-bold text-gray-700">
              Acerca de Nosotros
            </Text>

            <Text className="text-gray-600 text-center">
              Nuestra app está pensada para ayudarte a cuidar tu salud y
              bienestar de forma sencilla. Recopilamos algunos datos básicos
              durante tu registro para ofrecerte una experiencia adaptada y
              útil.
            </Text>

            <Divider />

            <View className="gap-y-4 w-full">
              <Text className="text-xl font-semibold text-gray-700">
                ¿Cómo funciona?
              </Text>

              <View className="flex-row items-start gap-x-2">
                <UsersRound size={20} className="mt-1 text-indigo-500" />
                <Text className="text-gray-600 flex-1">
                  <Text className="font-semibold">Registro rápido:</Text>{' '}
                  completa tu perfil con nombre, fecha de nacimiento, peso,
                  estatura y género.
                </Text>
              </View>

              <View className="flex-row items-start gap-x-2">
                <Zap size={20} className="mt-1 text-indigo-500" />
                <Text className="text-gray-600 flex-1">
                  <Text className="font-semibold">
                    Seguimiento inteligente:
                  </Text>{' '}
                  recibe análisis y recordatorios personalizados según tu
                  perfil.
                </Text>
              </View>

              <View className="flex-row items-start gap-x-2">
                <ShieldCheck size={20} className="mt-1 text-indigo-500" />
                <Text className="text-gray-600 flex-1">
                  <Text className="font-semibold">Privacidad primero:</Text> tus
                  datos están seguros y no se comparten sin tu consentimiento.
                </Text>
              </View>
            </View>

            <Divider />

            <View className="w-full">
              <Text className="text-xl font-semibold text-gray-700 mb-2">
                Autores
              </Text>
              <Text className="text-gray-600">Miguel Angel Velez Aguirre</Text>
              <Text className="text-gray-600">Brahian Carrera Rodriguez</Text>
              <Text className="text-gray-600">Diana Margot</Text>
            </View>

            <Pressable
              className="flex-row justify-center items-center border pl-2 border-gray-400 rounded-full mb-20 "
              onPress={() => {
                router.push('/users/login')
              }}
            >
              <Text>Regresar</Text>
              <ArrowBigLeft size={60} color="#14798B" />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaContainer>
  )
}

export default About
