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
    class="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(min(100%,14rem),1fr))] items-stretch gap-3 sm:gap-4"
    role="list"
    aria-label="Lista de produtos"
  >
    <div v-for="product in products" :key="product.id" class="h-full min-w-0" role="listitem">
      <ProductCard
        :product="product"
        :favorited="isFavorite(product.id)"
        @toggle-favorite="$emit('toggleFavorite', $event)"
      />
    </div>
  </div>
</template>
