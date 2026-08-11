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
    class="flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between"
  >
    <p class="text-sm text-slate-500" aria-live="polite">
      Mostrando {{ rangeStart }} a {{ rangeEnd }} de {{ totalProducts }} produtos
    </p>

    <Paginator
      v-if="showPageControls"
      :first="first"
      :rows="itemsPerPage"
      :total-records="totalProducts"
      template="PrevPageLink PageLinks NextPageLink"
      class="!bg-transparent !p-0"
      @page="onPage"
    />

    <div class="w-full sm:w-44">
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
</template>
