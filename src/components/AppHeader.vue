<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import PlusIcon from '@primevue/icons/plus'

import ThemeToggle from '@/components/ThemeToggle.vue'
import { useFavoritesStore } from '@/stores/favoritesStore'

const route = useRoute()
const favoritesStore = useFavoritesStore()

const favoritesCount = computed(() => favoritesStore.favoritesCount)

const isProductsActive = computed(
  () => route.name === 'produtos' || String(route.name ?? '').startsWith('produto'),
)

const isFavoritesActive = computed(() => route.name === 'favoritos')
</script>

<template>
  <header class="border-b border-slate-200 bg-white transition-colors duration-150 dark:border-slate-800 dark:bg-slate-950">
    <div
      class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6"
    >
      <RouterLink
        to="/produtos"
        class="flex items-center gap-2 rounded-md text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-slate-100"
        aria-label="Product Management — ir para produtos"
      >
        <span
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white"
          aria-hidden="true"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 7h12l-1 13H7L6 7Zm3-3h6l1 3H8l1-3Z"
            />
          </svg>
        </span>
        <span class="text-base font-semibold tracking-tight sm:text-lg">Product Management</span>
      </RouterLink>

      <nav class="order-3 flex w-full items-center justify-center gap-6 sm:order-none sm:w-auto" aria-label="Principal">
        <RouterLink
          to="/produtos"
          class="relative pb-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          :class="
            isProductsActive
              ? 'text-violet-700 dark:text-violet-300'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          "
          :aria-current="isProductsActive ? 'page' : undefined"
        >
          Produtos
          <span
            v-if="isProductsActive"
            class="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-violet-600 dark:bg-violet-400"
            aria-hidden="true"
          />
        </RouterLink>

        <RouterLink
          to="/favoritos"
          class="relative inline-flex items-center gap-1.5 pb-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          :class="
            isFavoritesActive
              ? 'text-violet-700 dark:text-violet-300'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          "
          :aria-current="isFavoritesActive ? 'page' : undefined"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"
            />
          </svg>
          Favoritos
          <span
            v-if="isFavoritesActive"
            class="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-violet-600 dark:bg-violet-400"
            aria-hidden="true"
          />
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <RouterLink
          to="/favoritos"
          class="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-slate-300 dark:hover:bg-slate-800"
          :aria-label="`Favoritos (${favoritesCount})`"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"
            />
          </svg>
          <span
            v-if="favoritesCount > 0"
            class="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-[11px] font-semibold text-white"
            aria-hidden="true"
          >
            {{ favoritesCount > 99 ? '99+' : favoritesCount }}
          </span>
        </RouterLink>

        <RouterLink to="/produtos/novo" class="inline-flex">
          <Button
            label="Novo Produto"
            severity="primary"
            class="!bg-violet-600 !border-violet-600 hover:!bg-violet-700"
          >
            <template #icon="slotProps">
              <PlusIcon v-bind="slotProps" />
            </template>
          </Button>
        </RouterLink>
      </div>
    </div>
  </header>
</template>
