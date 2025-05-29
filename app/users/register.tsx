import {
  View,
  Text,
  Pressable,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native'
import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react-native'
import DatePicker from 'react-native-date-picker'
import { Picker } from '@react-native-picker/picker'
import { registerUser } from 'services/userService'
import Logo from '../../assets/logo.svg'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [form, setForm] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    date: new Date(),
    gender: '',
    weightInt: 70,
    weightDec: 0,
    heightInt: 170,
    heightDec: 0,
    role: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {}
    setSubmitError('') // limpia errores anteriores

    if (!form.id.trim()) newErrors.id = 'La cédula es obligatoria'
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio.'
    if (!form.email.trim()) newErrors.email = 'El correo es obligatorio.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'El correo no es válido.'

    if (!form.password) newErrors.password = 'La contraseña es obligatoria.'
    else if (form.password.length < 6)
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.'

    if (!form.confirmPassword)
      newErrors.confirmPassword = 'Debes confirmar tu contraseña.'
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Las contraseñas no coinciden.'

    if (!form.gender) newErrors.gender = 'Selecciona un género.'
    if (!form.role) newErrors.role = 'Selecciona un rol.'

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      try {
        await handleRegister()
      } catch (error: any) {
        console.error('Error al registrar usuario:', error)
        setSubmitError('Ocurrió un error al registrar. Inténtalo de nuevo.')
      }
    }
  }

  const handleRegister = async () => {
    try {
      await registerUser(form)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 justify-center items-center px-4">
      <ScrollView className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 my-6 gap-y-6">
        <View className="items-center gap-y-2">
          <Logo className=" w-24 h-24 justify-center items-center" />
          <Text className="text-2xl font-bold text-gray-900">Registrate</Text>
          <Text className="text-gray-600">Crea una cuenta para continuar</Text>
        </View>

        <View className="gap-y-4">
          <Field label="Identificación">
            <TextInput
              className="h-12 px-4 border border-gray-300 rounded-md text-base"
              placeholder="Ingresa tu cédula"
              value={form.id}
              onChangeText={(val) => handleChange('id', val)}
            />
            {errors.id && (
              <Text className="text-red-500 text-sm">{errors.id}</Text>
            )}
          </Field>

          <Field label="Nombre">
            <TextInput
              className="h-12 px-4 border border-gray-300 rounded-md text-base"
              placeholder="Ingresa tu nombre"
              value={form.name}
              onChangeText={(val) => handleChange('name', val)}
            />
            {errors.name && (
              <Text className="text-red-500 text-sm">{errors.name}</Text>
            )}
          </Field>

          <Field label="Correo">
            <TextInput
              className="h-12 px-4 border border-gray-300 rounded-md text-base"
              placeholder="Ingresa tu Email"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(val) => handleChange('email', val)}
            />
            {errors.email && (
              <Text className="text-red-500 text-sm">{errors.email}</Text>
            )}
          </Field>

          <Field label="Contraseña">
            <PasswordInput
              value={form.password}
              onChangeText={(val) => handleChange('password', val)}
              show={showPassword}
              toggle={() =>
                handleChange('showPassword', setShowPassword(!showPassword))
              }
            />
            {errors.password && (
              <Text className="text-red-500 text-sm">{errors.password}</Text>
            )}
          </Field>

          <Field label="Confirmar Contraseña">
            <PasswordInput
              value={form.confirmPassword}
              onChangeText={(val) => handleChange('confirmPassword', val)}
              show={showConfirmPassword}
              toggle={() =>
                handleChange(
                  'showPassword',
                  setShowConfirmPassword(!showConfirmPassword),
                )
              }
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 text-sm">
                {errors.confirmPassword}
              </Text>
            )}
          </Field>

          <DatePicker
            date={form.date}
            onDateChange={(date) => handleChange('date', date)}
          />
          {errors.date && (
            <Text className="text-red-500 text-sm">{errors.name}</Text>
          )}

          <View className="gap-y-2">
            <Text className="text-sm font-medium text-gray-700">Genero</Text>

            <Picker
              selectedValue={form.gender}
              onValueChange={(val) => handleChange('gender', val)}
              className="h-12 px-4 border border-gray-300 rounded-md text-base bg-white"
            >
              <Picker.Item
                label="Selecciona un género..."
                value=""
                enabled={false}
              />
              <Picker.Item label="Masculino" value="MASCULINO" />
              <Picker.Item label="Femenino" value="FEMENINO" />
            </Picker>
            {errors.gender && (
              <Text className="text-red-500 text-sm">{errors.gender}</Text>
            )}
          </View>

          <View className="gap-y-2">
            <Text className="text-sm font-medium text-gray-700">Peso</Text>
            <View className="flex-row space-x-2">
              <Picker
                selectedValue={form.weightInt}
                onValueChange={(val) => handleChange('weightInt', val)}
                className="w-2/3 bg-white h-12 px-4 pr-12 border border-gray-300 rounded-md text-base"
              >
                {Array.from({ length: 90 }, (_, i) => (
                  <Picker.Item key={i} label={`${i + 40}`} value={i + 40} />
                ))}
              </Picker>

              <Picker
                selectedValue={form.weightDec}
                onValueChange={(val) => handleChange('weightDec', val)}
                className="w-1/3 bg-white border border-gray-300 rounded-md text-base"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <Picker.Item key={i} label={`.${i}`} value={i} />
                ))}
              </Picker>
            </View>
          </View>

          <View className="gap-y-2">
            <Text className="text-sm font-medium text-gray-700">Estatura</Text>
            <View className="flex-row space-x-2">
              <Picker
                selectedValue={form.heightInt}
                onValueChange={(val) => handleChange('heightInt', val)}
                className="w-2/3 bg-white h-12 px-4 pr-12 border border-gray-300 rounded-md text-base"
              >
                {Array.from({ length: 140 }, (_, i) => (
                  <Picker.Item key={i} label={`${i + 70}`} value={i + 70} />
                ))}
              </Picker>
              <Picker
                selectedValue={form.heightDec}
                onValueChange={(val) => handleChange('heightDec', val)}
                className="w-1/3 bg-white border border-gray-300 rounded-md"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <Picker.Item key={i} label={`.${i}`} value={i} />
                ))}
              </Picker>
            </View>
          </View>

          <View className="gap-y-2">
            <Text className="text-sm font-medium text-gray-700">Rol</Text>

            <Picker
              selectedValue={form.role}
              onValueChange={(val) => handleChange('role', val)}
              className="h-12 px-4 border border-gray-300 rounded-md text-base bg-white"
            >
              <Picker.Item label="Selecciona un rol" value="" enabled={false} />
              <Picker.Item label="Paciente" value="PACIENTE" />
              <Picker.Item label="Cuidador" value="CUIDADOR" />
            </Picker>
            {errors.gender && (
              <Text className="text-red-500 text-sm">{errors.gender}</Text>
            )}
          </View>

          <Pressable
            onPress={handleSubmit}
            className="bg-primary rounded-md h-12 justify-center items-center"
          >
            <Text className="text-base font-medium text-white">
              Crear cuenta
            </Text>
          </Pressable>
          {submitError ? (
            <Text className="text-red-500 text-center">{submitError}</Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <View className="gap-y-2">
      <Text className="text-sm font-medium text-gray-700">{label}</Text>
      {children}
    </View>
  )
}

function PasswordInput({
  value,
  onChangeText,
  show,
  toggle,
}: {
  value: string
  onChangeText: (text: string) => void
  show: boolean
  toggle: () => void
}) {
  return (
    <View className="relative">
      <TextInput
        className="h-12 px-4 pr-12 border border-gray-300 rounded-md text-base"
        placeholder="Ingresa tu contraseña"
        secureTextEntry={!show}
        value={value}
        onChangeText={onChangeText}
      />
      <Pressable
        onPress={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </Pressable>
    </View>
  )
}
