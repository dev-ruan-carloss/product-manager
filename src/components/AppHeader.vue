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
  <header
    class="border-b border-slate-200 bg-white pt-[env(safe-area-inset-top)] transition-colors duration-150 dark:border-slate-800 dark:bg-slate-950"
  >
    <div class="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-2 px-2.5 py-2.5 sm:gap-x-3 sm:gap-y-3 sm:px-6 sm:py-3">
      <RouterLink
        to="/produtos"
        class="flex min-w-0 max-w-full items-center gap-2 rounded-md text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-slate-100"
        aria-label="Product Management — ir para produtos"
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
        <span class="min-w-0 break-words text-sm font-semibold leading-snug tracking-tight sm:text-lg">
          Product Management
        </span>
      </RouterLink>

      <div class="ml-auto flex shrink-0 flex-wrap items-center gap-1 sm:gap-2 lg:order-last">
        <ThemeToggle />

        <RouterLink
          to="/favoritos"
          class="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-violet-500 sm:h-10 sm:w-10 dark:text-slate-300 dark:hover:bg-slate-800"
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

        <RouterLink to="/produtos/novo" class="hidden lg:inline-flex">
          <Button
            label="Novo Produto"
            severity="primary"
            class="!border-violet-600 !bg-violet-600 hover:!bg-violet-700"
          >
            <template #icon="slotProps">
              <PlusIcon v-bind="slotProps" />
            </template>
          </Button>
        </RouterLink>
      </div>

      <nav
        class="flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4 lg:w-auto lg:flex-1 lg:justify-center"
        aria-label="Principal"
      >
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
          <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
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

        <RouterLink to="/produtos/novo" class="inline-flex lg:hidden">
          <Button
            label="Novo Produto"
            size="small"
            severity="primary"
            class="!border-violet-600 !bg-violet-600 hover:!bg-violet-700"
          >
            <template #icon="slotProps">
              <PlusIcon v-bind="slotProps" />
            </template>
          </Button>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
