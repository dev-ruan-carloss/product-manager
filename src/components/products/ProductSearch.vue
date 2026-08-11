<script setup lang="ts">
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import SearchIcon from '@primevue/icons/search'

defineProps<{
  modelValue: string
  inputId?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="min-w-0 w-full">
    <label class="sr-only" :for="inputId ?? 'product-search'">Buscar produto</label>
    <IconField class="w-full min-w-0">
      <InputIcon>
        <SearchIcon />
      </InputIcon>
      <InputText
        :id="inputId ?? 'product-search'"
        :model-value="modelValue"
        class="w-full"
        placeholder="Buscar produto..."
        @input="onInput"
      />
    </IconField>
  </div>
</template>
