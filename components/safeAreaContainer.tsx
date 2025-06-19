// components/safeAreaContainer.tsx
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context' // <-- Importante: Este es el correcto

interface SafeAreaContainerProps {
  children: React.ReactNode
  style?: any // Para permitir estilos adicionales
}

const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({
  children,
  style,
}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Puedes añadir un color de fondo aquí si lo necesitas
    // backgroundColor: 'white',
  },
})

export default SafeAreaContainer
