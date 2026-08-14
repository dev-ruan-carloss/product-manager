/**
 * Limites de domínio do formulário de produto.
 *
 * A FakeStoreAPI não documenta máximos. Os valores abaixo cobrem o catálogo
 * atual (título ≤ 97, descrição ≤ 772, preço ≤ 999.99) com folga para criação,
 * sem restringir demais o domínio de um catálogo de varejo.
 */
export const PRODUCT_TITLE_MAX_LENGTH = 150
export const PRODUCT_DESCRIPTION_MAX_LENGTH = 1000
export const PRODUCT_PRICE_MAX = 999_999.99
export const PRODUCT_PRICE_FRACTION_DIGITS = 2

/**
 * Aceita inteiros e até `digits` casas decimais (ex.: 10, 10.5, 10.50).
 * Independente do locale: opera sobre o `number` interno.
 */
export function hasAtMostFractionDigits(value: number, digits: number): boolean {
  if (!Number.isFinite(value)) {
    return false
  }

  const factor = 10 ** digits
  return Math.abs(Math.round(value * factor) - value * factor) < 1e-6
}
