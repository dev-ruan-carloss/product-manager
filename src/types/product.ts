export interface ProductRating {
  rate: number
  count: number
}

/** Avaliação do usuário atual: somente quantidade de estrelas (1 a 5). */
export const USER_RATING_VALUES = [1, 2, 3, 4, 5] as const

export type UserRatingValue = (typeof USER_RATING_VALUES)[number]

export function isUserRatingValue(value: unknown): value is UserRatingValue {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5
}

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: ProductRating
}

export interface ProductCreatePayload {
  title: string
  price: number
  description: string
  category: string
  image: string
}

export interface ProductUpdatePayload {
  title: string
  price: number
  description: string
  category: string
  image: string
}
