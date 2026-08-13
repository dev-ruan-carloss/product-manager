<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import LocaleSelector from '@/components/LocaleSelector.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const { t } = useI18n()
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
  <footer
    class="border-t border-slate-200 bg-violet-100 pb-[env(safe-area-inset-bottom)] transition-colors duration-150 dark:border-slate-800 dark:bg-slate-950"
  >
    <div class="mx-auto max-w-7xl px-2.5 py-4 sm:px-6 sm:py-6">
      <div class="flex flex-col gap-3 sm:gap-4">
        <div class="flex min-w-0 flex-wrap items-start gap-x-3 gap-y-3">
          <div class="min-w-0 grow basis-[min(100%,14rem)]">
            <p class="text-base font-semibold tracking-tight whitespace-nowrap text-slate-900 sm:text-lg dark:text-slate-100">
              {{ t('brand.name') }}
            </p>
            <p class="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {{ t('brand.tagline') }}
            </p>
          </div>

          <div
            class="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-2"
            role="group"
            :aria-label="t('preferences.ariaLabel')"
          >
            <LocaleSelector />
            <ThemeToggle />
          </div>
        </div>

        <nav
          class="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-8"
          :aria-label="t('nav.footer')"
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
            {{ t('nav.products') }}
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
            {{ t('nav.favorites') }}
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
            {{ t('nav.newProductFooter') }}
          </RouterLink>
        </nav>

        <div class="border-t border-slate-200 pt-3 sm:pt-4 dark:border-slate-800">
          <p class="text-sm text-slate-500 dark:text-slate-400">{{ t('footer.copyright') }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>
