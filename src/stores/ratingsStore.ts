import { defineStore } from 'pinia'
import { ref } from 'vue'

import { isUserRatingValue, type UserRatingValue } from '@/types/product'

/** Chave centralizada para persistência das avaliações do usuário no localStorage. */
export const RATINGS_STORAGE_KEY = 'product-management:product-ratings'

function parseRatings(value: unknown): Record<number, UserRatingValue> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {}
  }

  const ratings: Record<number, UserRatingValue> = {}

  for (const [key, item] of Object.entries(value)) {
    const productId = Number(key)

    if (!Number.isInteger(productId) || productId <= 0 || !isUserRatingValue(item)) {
      continue
    }

    ratings[productId] = item
  }

  return ratings
}

function loadRatings(): Record<number, UserRatingValue> {
  try {
    const raw = localStorage.getItem(RATINGS_STORAGE_KEY)

    if (raw === null) {
      return {}
    }

    const parsed: unknown = JSON.parse(raw)
    return parseRatings(parsed)
  } catch {
    return {}
  }
}

function persistRatings(ratings: Record<number, UserRatingValue>): void {
  localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings))
}

export const useRatingsStore = defineStore('productRatings', () => {
  const ratings = ref<Record<number, UserRatingValue>>(loadRatings())

  function getRating(productId: number): UserRatingValue | undefined {
    return ratings.value[Number(productId)]
  }

  function hasRating(productId: number): boolean {
    return getRating(productId) !== undefined
  }

  /**
   * Grava ou substitui a avaliação do usuário e persiste.
   * Em falha de persistência, reverte o estado e retorna false.
   */
  function setRating(productId: number, rating: UserRatingValue): boolean {
    if (!Number.isInteger(productId) || productId <= 0 || !isUserRatingValue(rating)) {
      return false
    }

    const previous = { ...ratings.value }
    ratings.value = { ...ratings.value, [productId]: rating }

    try {
      persistRatings(ratings.value)
      return true
    } catch {
      ratings.value = previous
      return false
    }
  }

  return {
    ratings,
    getRating,
    hasRating,
    setRating,
  }
})
