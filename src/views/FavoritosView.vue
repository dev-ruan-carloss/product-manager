<script setup lang="ts">
import { useRouter } from 'vue-router'

import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ProductGrid from '@/components/products/ProductGrid.vue'
import { useFavoriteProducts } from '@/composables/useFavoriteProducts'

const router = useRouter()

const {
  favoriteProducts,
  favoritesCount,
  unavailableFavoritesCount,
  isLoading,
  hasError,
  isEmpty,
  isFavorite,
  toggleFavorite,
  loadFavoriteProducts,
} = useFavoriteProducts()

function goToCatalog(): void {
  void router.push({ name: 'produtos' })
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
    <nav class="mb-4 text-sm text-slate-400" aria-label="Trilha de navegação">
      <ol class="flex flex-wrap items-center gap-1.5">
        <li>
          <RouterLink
            to="/produtos"
            class="rounded-sm outline-none hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            Início
          </RouterLink>
        </li>
        <li aria-hidden="true">/</li>
        <li class="text-slate-500" aria-current="page">Favoritos</li>
      </ol>
    </nav>

    <header class="mb-6 space-y-1 sm:mb-8">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Meus Favoritos</h1>
      <p class="text-sm text-slate-500 sm:text-base">
        Produtos que você adicionou aos favoritos.
      </p>
    </header>

    <section class="min-w-0 space-y-5" aria-label="Produtos favoritos">
      <div
        v-if="!isEmpty && !hasError"
        class="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
      >
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white"
          aria-hidden="true"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path
              d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"
            />
          </svg>
        </span>
        <p class="text-sm font-medium text-slate-700">
          <span class="tabular-nums">{{ favoritesCount }}</span>
          {{ favoritesCount === 1 ? 'produto favoritado' : 'produtos favoritados' }}
        </p>
      </div>

      <LoadingState
        v-if="isLoading"
        title="Carregando favoritos"
        description="Aguarde enquanto buscamos seus produtos favoritos."
        :rows="Math.min(Math.max(favoritesCount, 1), 8)"
      />

      <ErrorState
        v-else-if="hasError"
        title="Não foi possível carregar os favoritos."
        description="Verifique sua conexão e tente novamente."
        @retry="loadFavoriteProducts"
      />

      <EmptyState
        v-else-if="isEmpty"
        title="Você ainda não possui favoritos."
        description="Navegue pelos produtos e clique no coração para adicioná-los aos favoritos."
        action-label="Ver produtos"
        @action="goToCatalog"
      />

      <EmptyState
        v-else-if="favoriteProducts.length === 0"
        title="Nenhum favorito disponível no momento."
        description="Os produtos favoritados não puderam ser encontrados no catálogo. Você pode voltar à listagem ou tentar novamente mais tarde."
        action-label="Ver produtos"
        @action="goToCatalog"
      />

      <template v-else>
        <ProductGrid
          :products="favoriteProducts"
          :is-favorite="isFavorite"
          @toggle-favorite="toggleFavorite"
        />

        <p
          v-if="unavailableFavoritesCount > 0"
          class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          role="status"
        >
          {{ unavailableFavoritesCount }}
          {{
            unavailableFavoritesCount === 1
              ? 'produto favoritado não está mais disponível no catálogo.'
              : 'produtos favoritados não estão mais disponíveis no catálogo.'
          }}
        </p>
      </template>
    </section>
  </div>
</template>
