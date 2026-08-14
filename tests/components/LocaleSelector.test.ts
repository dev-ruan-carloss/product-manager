import { beforeEach, describe, expect, it } from 'vitest'

import LocaleSelector from '@/components/LocaleSelector.vue'
import { useLocaleStore } from '@/stores/localeStore'
import { LOCALE_STORAGE_KEY } from '@/types/locale'
import { mountWithApp } from '../helpers/mountComponent'

describe('LocaleSelector', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renderiza label acessível e select com aria-label', async () => {
    const { wrapper } = await mountWithApp(LocaleSelector)

    expect(wrapper.get('label[for="app-locale-select"]').text()).toBe('Idioma')
    expect(wrapper.find('[aria-label="Selecionar idioma"]').exists()).toBe(true)
  })

  it('atualiza a localeStore ao emitir mudança no Select', async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'pt-BR')
    const { wrapper } = await mountWithApp(LocaleSelector)
    const localeStore = useLocaleStore()

    const select = wrapper.findComponent({ name: 'Select' })
    await select.vm.$emit('update:modelValue', 'en')

    expect(localeStore.locale).toBe('en')
  })
})
