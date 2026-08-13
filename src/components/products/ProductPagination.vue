<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Paginator, { type PageState } from 'primevue/paginator'
import Select from 'primevue/select'

import { ITEMS_PER_PAGE_OPTIONS } from '@/types/catalog'

const props = defineProps<{
  currentPage: number
  itemsPerPage: number
  totalProducts: number
  rangeStart: number
  rangeEnd: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:itemsPerPage': [rows: number]
}>()

const { t } = useI18n()

const first = computed(() => (props.currentPage - 1) * props.itemsPerPage)

const pageSizeOptions = computed(() =>
  ITEMS_PER_PAGE_OPTIONS.map((value) => ({
    label: t('catalog.perPage', { count: value }),
    value,
  })),
)

const showPagination = computed(() => props.totalProducts > 0)

const showPageControls = computed(() => props.totalProducts > props.itemsPerPage)

function onPage(event: PageState): void {
  emit('update:currentPage', event.page + 1)
  emit('update:itemsPerPage', event.rows)
}

function onItemsPerPageChange(value: number): void {
  emit('update:itemsPerPage', value)
}
</script>

<template>
  <nav
    v-if="showPagination"
    class="border-t border-slate-200 pt-3 sm:pt-4 dark:border-slate-700"
    :aria-label="t('catalog.paginationAria')"
  >
    <div class="pagination-toolbar">
      <p class="pagination-toolbar__range text-sm leading-relaxed text-slate-500 dark:text-slate-400" aria-live="polite">
        {{
          t('catalog.showingRange', {
            start: rangeStart,
            end: rangeEnd,
            total: totalProducts,
          })
        }}
      </p>

      <Paginator
        v-if="showPageControls"
        :first="first"
        :rows="itemsPerPage"
        :total-records="totalProducts"
        :page-link-size="3"
        template="PrevPageLink PageLinks NextPageLink"
        class="pagination-toolbar__paginator !bg-transparent !p-0"
        @page="onPage"
      />

      <label class="sr-only" for="items-per-page">{{ t('catalog.itemsPerPage') }}</label>
      <Select
        input-id="items-per-page"
        :model-value="itemsPerPage"
        :options="pageSizeOptions"
        option-label="label"
        option-value="value"
        class="pagination-page-size"
        @update:model-value="onItemsPerPageChange"
      />
    </div>
  </nav>
</template>
