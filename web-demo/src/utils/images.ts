/** Unsplash images per meal type — same URLs as the original app. */
export const MEAL_TYPE_IMAGES: Record<string, string> = {
  desayuno:
    'https://images.unsplash.com/photo-1504708706948-13d6cbba4062?q=80&w=800&auto=format&fit=crop',
  almuerzo:
    'https://images.unsplash.com/photo-1627662236973-4fd8358fa206?q=80&w=800&auto=format&fit=crop',
  cena:
    'https://images.unsplash.com/photo-1608835291093-394b0c943a75?q=80&w=800&auto=format&fit=crop',
  mediatarde:
    'https://images.unsplash.com/photo-1618902515708-0972a312344b?q=80&w=800&auto=format&fit=crop',
  merienda:
    'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=800&auto=format&fit=crop',
}

export const MEAL_TYPES = [
  'DESAYUNO',
  'ALMUERZO',
  'CENA',
  'MERIENDA',
  'MEDIATARDE',
] as const

export const MEAL_SIZES = ['PEQUENA', 'MEDIANA', 'GRANDE'] as const

export const FOOD_GROUPS = [
  'CARBOHIDRATOS',
  'FRUTAS',
  'VERDURAS',
  'LACTEOS',
  'PROTEINAS_ANIMALES',
  'PROTEINAS_VEGETALES',
  'GRASAS_SALUDABLES',
  'AZUCARES',
] as const

export const pretty = (v: string) =>
  v
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())
