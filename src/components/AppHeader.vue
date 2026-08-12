<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useFavoritesStore } from '@/stores/favoritesStore'

const { t } = useI18n()
const route = useRoute()
const favoritesStore = useFavoritesStore()

const favoritesCount = computed(() => favoritesStore.favoritesCount)

const isProductsActive = computed(() => {
  const name = String(route.name ?? '')
  return name === 'produtos' || name === 'produto-detalhes' || name === 'produto-editar'
})

const isFavoritesActive = computed(() => route.name === 'favoritos')

const isCreateActive = computed(() => route.name === 'produto-criar')
</script>

<template>
  <header
    class="border-b border-slate-200 bg-violet-100 pt-[env(safe-area-inset-top)] transition-colors duration-150 dark:border-slate-800 dark:bg-slate-950"
  >
    <div
      class="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-2 gap-y-2 px-2.5 py-2.5 sm:gap-x-3 sm:gap-y-3 sm:px-6 sm:py-3"
    >
      <RouterLink
        to="/produtos"
        class="flex shrink-0 items-center gap-1.5 rounded-md text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:gap-2 dark:text-slate-100"
        :aria-label="t('brand.homeAria')"
      >
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white sm:h-9 sm:w-9"
          aria-hidden="true"
        >
          <svg class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 7h12l-1 13H7L6 7Zm3-3h6l1 3H8l1-3Z"
            />
          </svg>
        </span>
        <span class="text-sm font-semibold leading-snug tracking-tight whitespace-nowrap sm:text-lg">
          {{ t('brand.name') }}
        </span>
      </RouterLink>

      <nav
        class="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-x-2 gap-y-2 max-[515px]:w-full max-[515px]:basis-full max-[515px]:grid max-[515px]:grid-cols-2 sm:gap-x-3"
        :aria-label="t('nav.main')"
      >
        <RouterLink
          to="/produtos"
          class="inline-flex shrink-0 items-center justify-center rounded-lg px-2.5 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-violet-500 max-[515px]:w-full sm:px-3"
          :class="
            isProductsActive
              ? 'bg-violet-200 font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
          "
          :aria-current="isProductsActive ? 'page' : undefined"
        >
          {{ t('nav.products') }}
        </RouterLink>

        <RouterLink
          to="/favoritos"
          class="relative inline-flex shrink-0 items-center justify-center gap-0.5 rounded-lg px-2.5 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-violet-500 max-[515px]:w-full sm:px-3"
          :class="
            isFavoritesActive
              ? 'bg-violet-200 font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
          "
          :aria-label="t('nav.favoritesWithCount', { count: favoritesCount })"
          :aria-current="isFavoritesActive ? 'page' : undefined"
        >
          <span class="relative mr-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden="true">
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              :fill="isFavoritesActive ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"
              />
            </svg>
            <span
              v-if="favoritesCount > 0"
              class="absolute -right-20 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-[11px] font-semibold text-white"
            >
              {{ favoritesCount > 99 ? '99+' : favoritesCount }}
            </span>
          </span>
          <span class="whitespace-nowrap">{{ t('nav.favorites') }}</span>
        </RouterLink>

        <RouterLink
          to="/produtos/novo"
          class="inline-flex shrink-0 items-center justify-center rounded-lg bg-violet-600 px-2.5 py-1.5 text-sm font-semibold whitespace-nowrap text-white outline-none transition-colors hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 max-[515px]:col-span-2 max-[515px]:mt-1 max-[515px]:w-full min-[516px]:ml-3 sm:ml-4 sm:px-3 dark:hover:bg-violet-500"
          :aria-current="isCreateActive ? 'page' : undefined"
        >
          {{ t('nav.newProduct') }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
