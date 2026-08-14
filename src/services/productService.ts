import api from '@/config/api'
import type { Category } from '@/types/category'
import type {
  Product,
  ProductCreatePayload,
  ProductUpdatePayload,
} from '@/types/product'
import {
  invalidProductResponseError,
  isValidProduct,
  toCategoryList,
  toProduct,
  toProductList,
} from '@/utils/normalizeProduct'

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<unknown>('/products')
  const products = toProductList(data)

  if (products === null) {
    throw invalidProductResponseError()
  }

  return products
}

export async function getProductById(id: number): Promise<Product> {
  const { data } = await api.get<unknown>(`/products/${id}`)

  if (!isValidProduct(data)) {
    throw invalidProductResponseError()
  }

  const product = toProduct(data)

  if (product === null) {
    throw invalidProductResponseError()
  }

  return product
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<unknown>('/products/categories')
  const categories = toCategoryList(data)

  if (categories === null) {
    throw invalidProductResponseError()
  }

  return categories
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
