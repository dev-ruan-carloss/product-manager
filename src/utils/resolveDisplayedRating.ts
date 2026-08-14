import { isUserRatingValue, type ProductRating, type UserRatingValue } from '@/types/product'

/**
 * Combina o `rating` original da FakeStoreAPI com a avaliação local do usuário.
 * Não altera o objeto original — a apresentação é sempre derivada.
 *
 * Primeira avaliação: incrementa `count` e recalcula a média.
 * Alteração: substitui a estrela do usuário na média, sem novo incremento
 * (o store guarda só a avaliação atual; o cálculo parte sempre do rating da API).
 */
export function resolveDisplayedRating(
  apiRating: ProductRating,
  userRating: UserRatingValue | undefined,
): ProductRating {
  if (userRating === undefined || !isUserRatingValue(userRating)) {
    return { rate: apiRating.rate, count: apiRating.count }
  }

  const baseCount = Math.max(0, apiRating.count)
  const count = baseCount + 1
  const rate = (apiRating.rate * baseCount + userRating) / count

  return { rate, count }
}
