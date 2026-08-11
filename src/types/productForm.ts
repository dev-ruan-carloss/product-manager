import type { Product } from '@/types/product'

/**
 * Estado interno do formulário de produto.
 * `price` e `category` ficam `undefined` enquanto o campo está vazio.
 */
export interface ProductFormData {
  title: string
  price: number | undefined
  description: string
  category: string | undefined
  image: string
}

export const EMPTY_PRODUCT_FORM: ProductFormData = {
  title: '',
  price: undefined,
  description: '',
  category: undefined,
  image: '',
}

/** Mapeia um produto da API para o estado inicial do formulário. */
export function toProductFormData(product: Product): ProductFormData {
  return {
    title: product.title,
    price: product.price,
    description: product.description,
    category: product.category,
    image: product.image,
  }
}
