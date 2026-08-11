<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isProductsActive = computed(
  () =>
    route.name === 'produtos' ||
    route.name === 'produto-detalhes' ||
    route.name === 'produto-editar',
)

const isFavoritesActive = computed(() => route.name === 'favoritos')

const isCreateActive = computed(() => route.name === 'produto-criar')

const linkClass =
  'rounded-md text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-violet-500'
</script>

<template>
  <footer class="border-t border-slate-200 bg-white transition-colors duration-150 dark:border-slate-800 dark:bg-slate-950">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div class="flex flex-col gap-6">
        <div>
          <p class="text-base font-semibold tracking-tight text-slate-900 sm:text-lg dark:text-slate-100">
            Product Management
          </p>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Catálogo de produtos • Favoritos • Gerenciamento
          </p>
        </div>

        <nav
          class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-2"
          aria-label="Rodapé"
        >
          <RouterLink
            to="/produtos"
            :class="[
              linkClass,
              isProductsActive
                ? 'text-violet-700 dark:text-violet-300'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
            ]"
            :aria-current="isProductsActive ? 'page' : undefined"
          >
            Produtos
          </RouterLink>

          <RouterLink
            to="/favoritos"
            :class="[
              linkClass,
              isFavoritesActive
                ? 'text-violet-700 dark:text-violet-300'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
            ]"
            :aria-current="isFavoritesActive ? 'page' : undefined"
          >
            Favoritos
          </RouterLink>

          <RouterLink
            to="/produtos/novo"
            :class="[
              linkClass,
              isCreateActive
                ? 'text-violet-700 dark:text-violet-300'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
            ]"
            :aria-current="isCreateActive ? 'page' : undefined"
          >
            Novo produto
          </RouterLink>
        </nav>

        <div class="border-t border-slate-200 pt-6 dark:border-slate-800">
          <p class="text-sm text-slate-500 dark:text-slate-400">© 2026 Product Management</p>
        </div>
      </div>
    </div>
  </footer>
</template>
