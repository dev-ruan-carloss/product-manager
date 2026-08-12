<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import StarFillIcon from '@primevue/icons/starfill'

import FavoriteButton from '@/components/FavoriteButton.vue'
import type { Product } from '@/types/product'
import { formatPrice } from '@/utils/formatPrice'
import { getLocalizedCategory } from '@/utils/localizeCategory'

const props = defineProps<{
  product: Product
  favorited: boolean
}>()

const emit = defineEmits<{
  toggleFavorite: [productId: number]
}>()

const { t, locale } = useI18n()
const imageFailed = ref(false)

const categoryLabel = computed(() => {
  void locale.value
  return getLocalizedCategory(props.product.category)
})

const ratingLabel = computed(() =>
  t('product.ratingLabel', {
    rate: props.product.rating.rate.toFixed(1),
    count: props.product.rating.count,
  }),
)

function onImageError(): void {
  imageFailed.value = true
}
</script>

<template>
  <article
    class="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600"
  >
    <div class="absolute right-2 top-2 z-10">
      <FavoriteButton :favorited="favorited" @toggle="emit('toggleFavorite', product.id)" />
    </div>

    <RouterLink
      :to="`/produtos/${product.id}`"
      class="flex h-full min-w-0 flex-col outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500"
    >
      <div
        class="flex h-28 w-full shrink-0 items-center justify-center bg-white px-3 pt-3 sm:h-36 sm:px-4 sm:pt-4 dark:bg-slate-800"
      >
        <img
          v-if="!imageFailed"
          :src="product.image"
          alt=""
          class="max-h-full w-full max-w-[7.5rem] object-contain sm:max-w-[9rem]"
          width="144"
          height="144"
          loading="lazy"
          @error="onImageError"
        />
        <div
          v-else
          class="flex h-full w-full max-w-[7.5rem] items-center justify-center rounded-lg bg-slate-50 text-center text-xs text-slate-400 sm:max-w-[9rem] dark:bg-slate-700 dark:text-slate-400"
          aria-hidden="true"
        >
          {{ t('product.imageUnavailable') }}
        </div>
      </div>

      <div class="flex min-w-0 flex-col gap-1.5 px-3 py-3 sm:gap-2 sm:px-4">
        <h3 class="line-clamp-2 break-words text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">
          {{ product.title }}
        </h3>

        <p class="break-words text-base font-bold leading-6 text-violet-700 dark:text-violet-300">
          {{ formatPrice(product.price) }}
        </p>

        <p class="break-words text-xs leading-4 text-slate-500 dark:text-slate-400">
          {{ categoryLabel }}
        </p>

        <div class="flex flex-wrap items-center gap-x-1 gap-y-0.5" :aria-label="ratingLabel">
          <StarFillIcon class="h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden="true" />
          <span class="text-xs font-medium text-slate-700 dark:text-slate-200">{{ product.rating.rate.toFixed(1) }}</span>
          <span class="text-xs text-slate-500 dark:text-slate-400">({{ product.rating.count }})</span>
        </div>
      </div>
    </RouterLink>
  </article>
</template>
