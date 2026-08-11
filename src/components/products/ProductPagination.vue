<script setup lang="ts">
import { computed } from 'vue'
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

const first = computed(() => (props.currentPage - 1) * props.itemsPerPage)

const pageSizeOptions = ITEMS_PER_PAGE_OPTIONS.map((value) => ({
  label: `${value} por página`,
  value,
}))

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
  <div
    v-if="showPagination"
    class="flex min-w-0 flex-col gap-2 border-t border-slate-200 pt-3 sm:gap-3 sm:pt-4 dark:border-slate-700"
  >
    <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400" aria-live="polite">
      Mostrando {{ rangeStart }} a {{ rangeEnd }} de {{ totalProducts }} produtos
    </p>

    <div class="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
      <Paginator
        v-if="showPageControls"
        :first="first"
        :rows="itemsPerPage"
        :total-records="totalProducts"
        :page-link-size="3"
        template="PrevPageLink PageLinks NextPageLink"
        class="!max-w-full !bg-transparent !p-0"
        @page="onPage"
      />

      <div class="min-w-0 w-full basis-full sm:w-auto sm:max-w-[11rem] sm:basis-auto sm:flex-1">
        <label class="sr-only" for="items-per-page">Itens por página</label>
        <Select
          input-id="items-per-page"
          :model-value="itemsPerPage"
          :options="pageSizeOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          @update:model-value="onItemsPerPageChange"
        />
      </div>
    </div>
  </div>
</template>
