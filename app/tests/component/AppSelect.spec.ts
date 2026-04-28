import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSelect from '~/components/common/AppSelect.vue'
import type { SelectOption } from '@ui'

const OPTIONS: SelectOption[] = [
  { value: 'fire', label: '火焰' },
  { value: 'ice', label: '冰霜' },
]

describe('AppSelect', () => {
  it('renders a combobox element', () => {
    const wrapper = mount(AppSelect, { attrs: { options: OPTIONS } })
    expect(wrapper.find('[role="combobox"]').exists()).toBe(true)
  })

  it('default borderColor is var(--color-primary)', () => {
    const wrapper = mount(AppSelect, { attrs: { options: [] } })
    expect(wrapper.props('borderColor')).toBe('var(--color-primary)')
  })

  it('custom borderColor overrides default', () => {
    const wrapper = mount(AppSelect, {
      props: { borderColor: '#123456' },
      attrs: { options: [] },
    })
    expect(wrapper.props('borderColor')).toBe('#123456')
  })

  it('placeholder attr passes through and shows when no value selected', () => {
    const wrapper = mount(AppSelect, {
      attrs: { options: OPTIONS, placeholder: '請選擇' },
    })
    expect(wrapper.text()).toContain('請選擇')
  })

  it('null placeholder does not throw', () => {
    expect(() => mount(AppSelect, { attrs: { options: OPTIONS, placeholder: null } })).not.toThrow()
  })

  it('selected value label is rendered', () => {
    const wrapper = mount(AppSelect, {
      attrs: { options: OPTIONS, modelValue: 'fire' },
    })
    expect(wrapper.text()).toContain('火焰')
  })

  it('disabled attr passes through', () => {
    const wrapper = mount(AppSelect, { attrs: { options: OPTIONS, disabled: true } })
    expect(wrapper.find('[role="combobox"]').attributes('aria-disabled')).toBe('true')
  })
})
