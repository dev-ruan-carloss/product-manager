import api from '@/config/api'
import type { Category } from '@/types/category'
import type {
  Product,
  ProductCreatePayload,
  ProductUpdatePayload,
} from '@/types/product'
import { invalidProductResponseError, toProduct } from '@/utils/normalizeProduct'

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products')
  return data
}

export async function getProductById(id: number): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`)
  return data
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/products/categories')
  return data
}

export async function createProduct(payload: ProductCreatePayload): Promise<Product> {
  const { data } = await api.post<unknown>('/products', payload)
  const product = toProduct(data)

  if (product === null) {
    throw invalidProductResponseError()
  }

  return product
}

export async function updateProduct(
  id: number,
  payload: ProductUpdatePayload,
): Promise<Product> {
  const { data } = await api.put<unknown>(`/products/${id}`, payload)
  const product = toProduct(data)

  if (product === null) {
    throw invalidProductResponseError()
  }

  return product
}

export const productService = {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
}
