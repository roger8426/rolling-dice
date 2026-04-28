import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import PageHeader from '~/components/common/PageHeader.vue'

function mountPageHeader(
  props: { title: string; showBack?: boolean; backTo?: string },
  routePath = '/',
) {
  vi.stubGlobal('useRoute', () => reactive({ path: routePath, fullPath: routePath }))
  return mount(PageHeader, { props })
}

describe('PageHeader', () => {
  it('renders the title', () => {
    const wrapper = mountPageHeader({ title: '角色列表' })
    expect(wrapper.find('h2').text()).toBe('角色列表')
  })

  it('back button is hidden by default', () => {
    const wrapper = mountPageHeader({ title: '首頁' })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('back button is visible when showBack=true', () => {
    const wrapper = mountPageHeader({ title: '詳情', showBack: true }, '/character/123')
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').attributes('aria-label')).toBe('返回上層')
  })

  it('clicking back with backTo calls navigateTo(backTo)', async () => {
    const navigateTo = vi.fn()
    vi.stubGlobal('navigateTo', navigateTo)
    const wrapper = mountPageHeader(
      { title: '編輯', showBack: true, backTo: '/characters' },
      '/character/123/update',
    )
    await wrapper.find('button').trigger('click')
    expect(navigateTo).toHaveBeenCalledWith('/characters')
  })

  it('clicking back without backTo derives parent path', async () => {
    const navigateTo = vi.fn()
    vi.stubGlobal('navigateTo', navigateTo)
    const wrapper = mountPageHeader({ title: '詳情', showBack: true }, '/character/123')
    await wrapper.find('button').trigger('click')
    expect(navigateTo).toHaveBeenCalledWith('/character')
  })

  it('clicking back at root level navigates to /', async () => {
    const navigateTo = vi.fn()
    vi.stubGlobal('navigateTo', navigateTo)
    const wrapper = mountPageHeader({ title: '首頁', showBack: true }, '/about')
    await wrapper.find('button').trigger('click')
    expect(navigateTo).toHaveBeenCalledWith('/')
  })

  it('actions slot is rendered', () => {
    vi.stubGlobal('useRoute', () => reactive({ path: '/', fullPath: '/' }))
    const wrapper = mount(PageHeader, {
      props: { title: '法術' },
      slots: { actions: '<button id="slot-btn">新增</button>' },
    })
    expect(wrapper.find('#slot-btn').exists()).toBe(true)
  })
})
