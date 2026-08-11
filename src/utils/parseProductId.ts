/**
 * Converte o parâmetro de rota em um ID de produto válido.
 * Retorna `null` quando o valor não é um inteiro positivo seguro.
 */
export function parseProductId(param: string | string[] | undefined): number | null {
  const raw = Array.isArray(param) ? param[0] : param

  if (raw === undefined || raw === '') {
    return null
  }

  if (!/^\d+$/.test(raw)) {
    return null
  }

  const id = Number(raw)

  if (!Number.isSafeInteger(id) || id <= 0) {
    return null
  }

  return id
}
