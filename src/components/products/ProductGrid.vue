<script setup lang="ts">
import ProductCard from '@/components/products/ProductCard.vue'
import type { Product } from '@/types/product'

defineProps<{
  products: Product[]
  isFavorite: (productId: number) => boolean
}>()

defineEmits<{
  toggleFavorite: [productId: number]
}>()
</script>

<template>
  <div
    class="grid auto-rows-fr grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    role="list"
    aria-label="Lista de produtos"
  >
    <div v-for="product in products" :key="product.id" class="h-full min-h-0" role="listitem">
      <ProductCard
        :product="product"
        :favorited="isFavorite(product.id)"
        @toggle-favorite="$emit('toggleFavorite', $event)"
      />
    </div>
  </div>
</template>
