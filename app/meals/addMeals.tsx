import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native'
import Toast from 'react-native-toast-message'
import KeyboardAvoidingContainer from 'components/KeyboardAvoidingContainer'
import { Picker } from '@react-native-picker/picker'
import { Apple, Plus } from 'lucide-react-native'
import { red100 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors'
import { addMeal } from 'services/mealService'

interface Ingredient {
  name: string
  quantity: number | ''
  unit: string
}

interface FoodData {
  name: string
  type: string
  size: string
  calories: number | ''
  protein: number | ''
  carbs: number | ''
  sugar: number | ''
  fat: number | ''
  fiber: number | ''
  sodium: number | ''
  foodGroup: string
  ingredients: Ingredient[]
}

interface FormErrors {
  [key: string]: string
}

const INITIAL_FORM_STATE: FoodData = {
  name: '',
  type: '',
  size: '',
  calories: '',
  protein: '',
  carbs: '',
  sugar: '',
  fat: '',
  fiber: '',
  sodium: '',
  foodGroup: '',
  ingredients: [{ name: '', quantity: '', unit: '' }],
}

const MEAL_TYPE_OPTIONS = [
  { label: 'Selecciona un tipo de comida...', value: '', enabled: false },
  { label: 'Desayuno', value: 'DESAYUNO' },
  { label: 'Almuerzo', value: 'ALMUERZO' },
  { label: 'Cena', value: 'CENA' },
  { label: 'Merienda', value: 'MERIENDA' },
  { label: 'Media Tarde', value: 'MEDIATARDE' },
]
const MEAL_FOODGROUP_OPTIONS = [
  { label: 'Selecciona un grupo alimenticio...', value: '', enabled: false },
  { label: 'Carbohidratos', value: 'CARBOHIDRATOS' },
  { label: 'Frutas', value: 'FRUTAS' },
  { label: 'Verduras', value: 'VERDURAS' },
  { label: 'Lacteos', value: 'LACTEOS' },
  { label: 'Proteínas Animales', value: 'PROTEINAS_ANIMALES' },
  { label: 'Proteína Vegetal', value: 'PROTEINAS_VEGETALES' },
  { label: 'Grasas Saludables', value: 'GRASAS_SALUDABLES' },
  { label: 'Azúcares', value: 'AZUCARES' },
]

const MEAL_SIZE_OPTIONS = [
  { label: 'Selecciona un tamaño...', value: '', enabled: false },
  { label: 'Pequeña', value: 'PEQUEÑA' },
  { label: 'Mediana', value: 'MEDIANA' },
  { label: 'Grande', value: 'GRANDE' },
]

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <View className="gap-y-2">
    <Text className="text-sm font-medium text-gray-700">{label}</Text>
    {children}
  </View>
)

const ErrorText: React.FC<{ error?: string }> = ({ error }) => {
  if (!error) return null
  return <Text className="text-red-500 text-sm mt-1">{error}</Text>
}

export default function CreateFoodScreen() {
  const [form, setForm] = useState<FoodData>(INITIAL_FORM_STATE)
  const [errors, setErrors] = useState<FormErrors>({ FoodData: ' ' })
  const [loading, setLoading] = useState<boolean>(false)

  const updateForm = (field: keyof FoodData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateNumberField = (field: keyof FoodData, text: string) => {
    const num = parseFloat(text)
    if (!isNaN(num) || text === '') {
      updateForm(field, text === '' ? '' : num)
    }
  }

  const addIngredient = () => {
    setForm((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '' }],
    }))
  }

  const removeIngredient = (index: number) => {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
  }

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string,
  ) => {
    setForm((prev) => {
      const newIngredients = [...prev.ingredients]
      if (field === 'quantity') {
        const num = parseFloat(value)
        newIngredients[index] = {
          ...newIngredients[index],
          [field]: value === '' ? '' : num,
        }
      } else {
        newIngredients[index] = { ...newIngredients[index], [field]: value }
      }
      return { ...prev, ingredients: newIngredients }
    })
  }

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}

    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio.'
    if (!form.type.trim()) newErrors.type = 'El tipo es obligatorio.'
    if (!form.size.trim()) newErrors.size = 'El tamaño es obligatorio.'
    if (form.calories === '' || isNaN(Number(form.calories)))
      newErrors.calories =
        'Las calorías son obligatorias y deben ser un número.'
    if (form.protein === '' || isNaN(Number(form.protein)))
      newErrors.protein = 'La proteína es obligatoria y debe ser un número.'
    if (form.carbs === '' || isNaN(Number(form.carbs)))
      newErrors.carbs =
        'Los carbohidratos son obligatorios y deben ser un número.'
    if (form.sugar === '' || isNaN(Number(form.sugar)))
      newErrors.sugar = 'El azúcar es obligatorio y debe ser un número.'
    if (form.fat === '' || isNaN(Number(form.fat)))
      newErrors.fat = 'La grasa es obligatoria y debe ser un número.'
    if (form.fiber === '' || isNaN(Number(form.fiber)))
      newErrors.fiber = 'La fibra es obligatoria y debe ser un número.'
    if (form.sodium === '' || isNaN(Number(form.sodium)))
      newErrors.sodium = 'El sodio es obligatorio y debe ser un número.'
    if (!form.foodGroup.trim())
      newErrors.foodGroup = 'El grupo alimenticio es obligatorio.'

    form.ingredients.forEach((ing, index) => {
      if (
        !ing.name.trim() ||
        ing.quantity === '' ||
        isNaN(Number(ing.quantity)) ||
        !ing.unit.trim()
      ) {
        newErrors.ingredients =
          newErrors.ingredients ||
          'Todos los campos de los ingredientes son obligatorios y la cantidad debe ser un número.'
      }
    })

    return newErrors
  }

  const handleSubmit = () => {
    setLoading(true)
    const validationErrors = validateForm()
    setErrors(validationErrors)

    console.log(Object.keys(validationErrors).length)

    console.log(Object.keys(validationErrors))

    if (Object.keys(validationErrors).length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Error de validación',
        text2: 'Por favor, revisa los campos marcados.',
        position: 'bottom',
      })
      setLoading(false)
      return
    }

    const payload = {
      name: form.name,
      type: form.type,
      size: form.size,
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      sugar: Number(form.sugar),
      fat: Number(form.fat),
      fiber: Number(form.fiber),
      sodium: Number(form.sodium),
      foodGroup: form.foodGroup,

      ingredients: form.ingredients.map((ing) => ({
        ...ing,
        quantity: Number(ing.quantity),
      })),
    }

    try {
      addMeal(payload)

      Toast.show({
        type: 'success',
        text1: 'Comida creada',
        text2: 'El alimento ha sido registrado exitosamente.',
        position: 'bottom',
      })
      setForm(INITIAL_FORM_STATE)
    } catch (apiError) {
      console.error('Error al crear la comida:', apiError)
      Toast.show({
        type: 'error',
        text1: 'Error al guardar',
        text2: 'No se pudo registrar la comida. Intenta de nuevo.',
        position: 'bottom',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingContainer>
      <View className="items-center gap-y-4">
        <Apple width={120} height={120} color={'#e64635'} />
        <Text className="text-2xl font-bold text-gray-900">
          Crear Nueva Comida
        </Text>
        <Text className="text-gray-600 text-center">
          Introduce los detalles para registrar un nuevo plato o alimento.
        </Text>
      </View>
      <View className="mt-4 gap-y-4">
        <Field label="Nombre del Plato">
          <TextInput
            className=" px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ej. Sopa Ligera"
            value={form.name}
            onChangeText={(text) => updateForm('name', text)}
          />
          <ErrorText error={errors.name} />
        </Field>

        <Field label="Tipo de Comida">
          <View className="border border-gray-300 rounded-md bg-white">
            <Picker
              selectedValue={form.type}
              onValueChange={(itemValue: string) =>
                updateForm('type', itemValue)
              }
              style={{ width: '100%' }}
            >
              {MEAL_TYPE_OPTIONS.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  enabled={option.enabled !== false}
                />
              ))}
            </Picker>
          </View>
          <ErrorText error={errors.type} />
        </Field>

        <Field label="Tamaño (ej. MEDIANA, GRANDE)">
          <View className="border border-gray-300 rounded-md bg-white">
            <Picker
              selectedValue={form.size}
              onValueChange={(itemValue: string) =>
                updateForm('size', itemValue)
              }
              style={{ width: '100%' }}
            >
              {MEAL_SIZE_OPTIONS.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  enabled={option.enabled !== false}
                />
              ))}
            </Picker>
          </View>
          <ErrorText error={errors.size} />
        </Field>

        <Field label="Grupo Alimenticio (ej. VERDURAS)">
          <View className="border border-gray-300 rounded-md bg-white">
            <Picker
              selectedValue={form.foodGroup}
              onValueChange={(itemValue: string) =>
                updateForm('foodGroup', itemValue)
              }
              style={{ width: '100%' }}
            >
              {MEAL_FOODGROUP_OPTIONS.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  enabled={option.enabled !== false}
                />
              ))}
            </Picker>
          </View>
          <ErrorText error={errors.foodGroup} />
        </Field>

        <Field label="Calorías (kcal)">
          <TextInput
            className=" px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ej. 320"
            keyboardType="numeric"
            value={form.calories.toString()}
            onChangeText={(text) => updateNumberField('calories', text)}
          />
          <ErrorText error={errors.calories} />
        </Field>

        <Field label="Proteína (g)">
          <TextInput
            className=" px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ej. 12"
            keyboardType="numeric"
            value={form.protein.toString()}
            onChangeText={(text) => updateNumberField('protein', text)}
          />
          <ErrorText error={errors.protein} />
        </Field>

        <Field label="Carbohidratos (g)">
          <TextInput
            className=" px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ej. 28"
            keyboardType="numeric"
            value={form.carbs.toString()}
            onChangeText={(text) => updateNumberField('carbs', text)}
          />
          <ErrorText error={errors.carbs} />
        </Field>

        <Field label="Azúcar (g)">
          <TextInput
            className=" px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ej. 5"
            keyboardType="numeric"
            value={form.sugar.toString()}
            onChangeText={(text) => updateNumberField('sugar', text)}
          />
          <ErrorText error={errors.sugar} />
        </Field>

        <Field label="Grasa (g)">
          <TextInput
            className=" px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ej. 15"
            keyboardType="numeric"
            value={form.fat.toString()}
            onChangeText={(text) => updateNumberField('fat', text)}
          />
          <ErrorText error={errors.fat} />
        </Field>

        <Field label="Fibra (g)">
          <TextInput
            className=" px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ej. 4"
            keyboardType="numeric"
            value={form.fiber.toString()}
            onChangeText={(text) => updateNumberField('fiber', text)}
          />
          <ErrorText error={errors.fiber} />
        </Field>

        <Field label="Sodio (mg)">
          <TextInput
            className="px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ej. 850"
            keyboardType="numeric"
            value={form.sodium.toString()}
            onChangeText={(text) => updateNumberField('sodium', text)}
          />
          <ErrorText error={errors.sodium} />
        </Field>

        <View className="gap-y-4 border border-gray-200 p-4 rounded-md">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Ingredientes
          </Text>
          {form.ingredients.map((ingredient, index) => (
            <View
              key={index}
              className="flex-col gap-y-2 mb-4 p-2 border border-gray-100 rounded-md bg-gray-50"
            >
              <Text className="text-xs font-bold text-gray-600">
                Ingrediente {index + 1}
              </Text>
              <TextInput
                className=" px-3 border border-gray-300 rounded-md text-base"
                placeholder="Nombre"
                value={ingredient.name}
                onChangeText={(text) => updateIngredient(index, 'name', text)}
              />
              <TextInput
                className=" px-3 border border-gray-300 rounded-md text-base"
                placeholder="Cantidad"
                keyboardType="numeric"
                value={ingredient.quantity.toString()}
                onChangeText={(text) =>
                  updateIngredient(index, 'quantity', text)
                }
              />
              <TextInput
                className=" px-3 border border-gray-300 rounded-md text-base"
                placeholder="Unidad (ej. g, ml, rebanada)"
                value={ingredient.unit}
                onChangeText={(text) => updateIngredient(index, 'unit', text)}
              />
              {form.ingredients.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeIngredient(index)}
                  className="bg-red-500 rounded-md justify-center items-center mt-2"
                >
                  <Text className="text-white text-sm font-medium">
                    Remover Ingrediente
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity
            onPress={addIngredient}
            className="bg-gray-300 border-4 border-primary rounded-md h-12 justify-center gap-x-2 items-center flex-row mt-2"
          >
            <Plus size={20} color={'#14798B'} />
            <Text className="text-primary text-base font-medium">
              Añadir Ingrediente
            </Text>
          </TouchableOpacity>
          <ErrorText error={errors.ingredients} />
        </View>

        <Pressable
          onPress={handleSubmit}
          className={`bg-primary rounded-md h-12 justify-center items-center my-10 ${loading ? 'opacity-70' : ''}`}
          disabled={loading}
        >
          <Text className="text-base font-medium text-white">
            {loading ? 'Guardando...' : 'Guardar Comida'}
          </Text>
        </Pressable>
      </View>
      <Toast />
    </KeyboardAvoidingContainer>
  )
}
