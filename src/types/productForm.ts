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
