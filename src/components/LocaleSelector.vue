<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'

import { useLocaleStore } from '@/stores/localeStore'
import { isAppLocale, SUPPORTED_LOCALES, type AppLocale } from '@/types/locale'

const { t } = useI18n()
const localeStore = useLocaleStore()

const FLAG_BY_LOCALE: Record<AppLocale, string> = {
  'pt-BR': '🇧🇷',
  es: '🇪🇸',
  en: '🇺🇸',
}

const localeOptions = computed(() =>
  SUPPORTED_LOCALES.map((value) => ({
    value,
    flag: FLAG_BY_LOCALE[value],
    short: t(`locale.short.${value}`),
    medium: t(`locale.medium.${value}`),
    full: t(
      value === 'pt-BR' ? 'locale.ptBR' : value === 'es' ? 'locale.es' : 'locale.en',
    ),
  })),
)

function onLocaleChange(value: AppLocale): void {
  localeStore.setLocale(value)
}
</script>

<template>
  <div class="min-w-0">
    <label class="sr-only" for="app-locale-select">{{ t('locale.label') }}</label>
    <Select
      input-id="app-locale-select"
      :model-value="localeStore.locale"
      :options="localeOptions"
      option-label="full"
      option-value="value"
      class="locale-select w-auto min-w-0"
      :aria-label="t('locale.ariaLabel')"
      @update:model-value="onLocaleChange"
    >
      <template #value="{ value }">
        <span
          v-if="value"
          class="inline-flex min-w-0 items-center gap-1.5"
        >
          <span aria-hidden="true">{{ isAppLocale(value) ? FLAG_BY_LOCALE[value] : '' }}</span>
          <span class="sm:hidden">{{ t(`locale.short.${value}`) }}</span>
          <span class="hidden sm:inline">{{ t(`locale.medium.${value}`) }}</span>
          <span class="sr-only">
            {{
              value === 'pt-BR'
                ? t('locale.ptBR')
                : value === 'es'
                  ? t('locale.es')
                  : t('locale.en')
            }}
          </span>
        </span>
      </template>
      <template #option="{ option }">
        <span class="inline-flex min-w-0 items-center gap-2">
          <span aria-hidden="true">{{ option.flag }}</span>
          <span class="min-w-0 break-words">{{ option.full }}</span>
        </span>
      </template>
    </Select>
  </div>
</template>
