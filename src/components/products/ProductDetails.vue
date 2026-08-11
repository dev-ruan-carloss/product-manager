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
  toggleFavorite: []
}>()

const imageFailed = ref(false)

const imageAlt = computed(() => `Imagem do produto ${props.product.title}`)

const ratingLabel = computed(
  () =>
    `Avaliação ${props.product.rating.rate.toFixed(1)} de 5, com ${props.product.rating.count} avaliações`,
)

const favoriteActionLabel = computed(() =>
  props.favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos',
)

function onImageError(): void {
  imageFailed.value = true
}
</script>

<template>
  <article
    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950"
    :aria-labelledby="`product-title-${product.id}`"
  >
    <div class="grid gap-0 lg:grid-cols-2">
      <div class="relative border-b border-slate-100 bg-white p-6 sm:p-8 lg:border-b-0 lg:border-r dark:border-slate-800 dark:bg-slate-800 lg:dark:border-r-slate-800">
        <div class="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
          <FavoriteButton :favorited="favorited" @toggle="emit('toggleFavorite')" />
        </div>

        <div class="flex min-h-[16rem] items-center justify-center sm:min-h-[20rem] lg:min-h-[24rem]">
          <img
            v-if="!imageFailed"
            :src="product.image"
            :alt="imageAlt"
            class="max-h-72 w-full max-w-sm object-contain sm:max-h-80"
            width="320"
            height="320"
            @error="onImageError"
          />
          <div
            v-else
            class="flex h-64 w-full max-w-sm items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400 dark:bg-slate-700 dark:text-slate-400"
            role="img"
            :aria-label="imageAlt"
          >
            Imagem indisponível
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-5 p-6 sm:p-8">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <span
            class="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-medium capitalize text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
          >
            {{ product.category }}
          </span>

          <span
            v-if="favorited"
            class="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300"
          >
            <svg
              class="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"
              />
            </svg>
            Favoritado
          </span>
        </div>

        <div class="space-y-3">
          <h1
            :id="`product-title-${product.id}`"
            class="text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl dark:text-slate-100"
          >
            {{ product.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-1.5" :aria-label="ratingLabel">
            <StarFillIcon class="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
            <span class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ product.rating.rate.toFixed(1) }}</span>
            <span class="text-sm text-slate-500 dark:text-slate-400">
              ({{ product.rating.count }}
              {{ product.rating.count === 1 ? 'avaliação' : 'avaliações' }})
            </span>
          </div>

          <p class="text-3xl font-bold tracking-tight text-violet-700 dark:text-violet-300">
            {{ formatPrice(product.price) }}
          </p>
        </div>

        <section class="space-y-2 border-t border-slate-100 pt-5 dark:border-slate-800" aria-labelledby="product-description-heading">
          <h2 id="product-description-heading" class="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Descrição
          </h2>
          <p class="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
            {{ product.description }}
          </p>
        </section>

        <div class="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:flex-wrap dark:border-slate-800">
          <button
            type="button"
            class="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 sm:w-auto"
            :class="
              favorited
                ? 'border border-violet-300 bg-white text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:bg-slate-950 dark:text-violet-300 dark:hover:bg-violet-950/40'
                : 'bg-violet-600 text-white hover:bg-violet-700'
            "
            :aria-pressed="favorited"
            @click="emit('toggleFavorite')"
          >
            <svg
              class="h-5 w-5"
              viewBox="0 0 24 24"
              :fill="favorited ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"
              />
            </svg>
            {{ favoriteActionLabel }}
          </button>

          <RouterLink
            :to="{ name: 'produto-editar', params: { id: product.id } }"
            class="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950 sm:w-auto"
          >
            <svg
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
              />
            </svg>
            Editar produto
          </RouterLink>
        </div>
      </div>
    </div>
  </article>
</template>
