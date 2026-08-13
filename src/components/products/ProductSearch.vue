<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import SearchIcon from '@primevue/icons/search'

import { useInitialFocus } from '@/composables/useInitialFocus'

const props = withDefaults(
  defineProps<{
    modelValue: string
    inputId?: string
    /** Quando true, foca o campo ao montar se estiver visível e sem foco do usuário. */
    autofocus?: boolean
  }>(),
  {
    inputId: undefined,
    autofocus: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()

const resolvedInputId = computed(() => props.inputId ?? 'product-search')

useInitialFocus(resolvedInputId, { enabled: () => props.autofocus })

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="min-w-0 w-full">
    <label class="sr-only" :for="resolvedInputId">{{ t('catalog.searchLabel') }}</label>
    <IconField class="w-full min-w-0">
      <InputIcon aria-hidden="true">
        <SearchIcon aria-hidden="true" />
      </InputIcon>
      <InputText
        :id="resolvedInputId"
        :model-value="modelValue"
        type="search"
        class="w-full"
        :placeholder="t('catalog.searchPlaceholder')"
        autocomplete="off"
        enterkeyhint="search"
        @input="onInput"
      />
    </IconField>
  </div>
</template>
