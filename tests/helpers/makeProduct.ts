import type { Product } from '@/types/product'

/** Factory de produto alinhada ao contrato FakeStoreAPI / `Product`. */
export function makeProduct(partial: Partial<Product> = {}): Product {
  return {
    id: 1,
    title: 'Sample product',
    price: 10,
    description: 'desc',
    category: 'electronics',
    image: 'https://example.com/a.jpg',
    rating: { rate: 3, count: 10 },
    ...partial,
  }
}
