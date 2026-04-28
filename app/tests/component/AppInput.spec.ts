import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppInput from '~/components/common/AppInput.vue'

describe('AppInput', () => {
  it('renders an input element', () => {
    const wrapper = mount(AppInput)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('default borderColor is var(--color-primary)', () => {
    const wrapper = mount(AppInput)
    expect(wrapper.props('borderColor')).toBe('var(--color-primary)')
  })

  it('custom borderColor overrides default', () => {
    const wrapper = mount(AppInput, { props: { borderColor: '#ff0000' } })
    expect(wrapper.props('borderColor')).toBe('#ff0000')
  })

  it('modelValue attr passes through to the input value', () => {
    const wrapper = mount(AppInput, { attrs: { modelValue: '火焰箭' } })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('火焰箭')
  })

  it('placeholder attr passes through to the input', () => {
    const wrapper = mount(AppInput, { attrs: { placeholder: '輸入名稱' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('輸入名稱')
  })

  it('null placeholder does not set the placeholder attribute', () => {
    const wrapper = mount(AppInput, { attrs: { placeholder: null } })
    expect(wrapper.find('input').attributes('placeholder')).toBeUndefined()
  })

  it('fires update:modelValue handler when input changes', async () => {
    const handler = vi.fn()
    const wrapper = mount(AppInput, {
      attrs: { modelValue: '', 'onUpdate:modelValue': handler },
    })
    await wrapper.find('input').setValue('abc')
    expect(handler).toHaveBeenCalledWith('abc')
  })

  it('disabled attr passes through', () => {
    const wrapper = mount(AppInput, { attrs: { disabled: true } })
    expect(wrapper.find('input').element.disabled).toBe(true)
  })
})
