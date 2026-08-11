<script setup lang="ts">
import { computed, ref } from 'vue'
import StarFillIcon from '@primevue/icons/starfill'

import FavoriteButton from '@/components/FavoriteButton.vue'
import type { Product } from '@/types/product'
import { formatPrice } from '@/utils/formatPrice'

const props = defineProps<{
  product: Product
  favorited: boolean
}>()

const emit = defineEmits<{
  toggleFavorite: [productId: number]
}>()

const imageFailed = ref(false)

const imageAlt = computed(() => `Imagem do produto ${props.product.title}`)

const ratingLabel = computed(
  () =>
    `Avaliação ${props.product.rating.rate.toFixed(1)} de 5, com ${props.product.rating.count} avaliações`,
)

function onImageError(): void {
  imageFailed.value = true
}
</script>

<template>
  <article
    class="group relative flex h-full min-h-[22.5rem] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600"
  >
    <div class="absolute right-3 top-3 z-10">
      <FavoriteButton :favorited="favorited" @toggle="emit('toggleFavorite', product.id)" />
    </div>

    <RouterLink
      :to="`/produtos/${product.id}`"
      class="flex h-full min-h-0 flex-col outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500"
    >
      <div class="flex h-48 w-full shrink-0 items-center justify-center bg-white px-6 pt-6 dark:bg-slate-800">
        <img
          v-if="!imageFailed"
          :src="product.image"
          :alt="imageAlt"
          class="h-36 w-36 object-contain"
          width="144"
          height="144"
          loading="lazy"
          @error="onImageError"
        />
        <div
          v-else
          class="flex h-36 w-36 items-center justify-center rounded-lg bg-slate-50 text-center text-xs text-slate-400 dark:bg-slate-700 dark:text-slate-400"
          role="img"
          :aria-label="imageAlt"
        >
          Imagem indisponível
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3">
        <h3 class="line-clamp-2 h-10 text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">
          {{ product.title }}
        </h3>

        <p class="h-6 text-base font-bold leading-6 text-violet-700 dark:text-violet-300">
          {{ formatPrice(product.price) }}
        </p>

        <p class="h-4 truncate text-xs capitalize leading-4 text-slate-500 dark:text-slate-400">
          {{ product.category }}
        </p>

        <div class="flex h-5 items-center gap-1" :aria-label="ratingLabel">
          <StarFillIcon class="h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden="true" />
          <span class="text-xs font-medium text-slate-700 dark:text-slate-200">{{ product.rating.rate.toFixed(1) }}</span>
          <span class="text-xs text-slate-500 dark:text-slate-400">({{ product.rating.count }})</span>
        </div>
      </div>
    </RouterLink>
  </article>
</template>
