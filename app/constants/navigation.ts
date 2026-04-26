import type { NavItem } from '~/types/layout/navigation'

export const navItems: readonly NavItem[] = [
  { label: '角色卡', to: '/character', icon: 'profile' },
  { label: 'DM 相關', to: '/dm', icon: 'dice', disabled: true },
  { label: '其他工具', to: '/tools', icon: 'tool', disabled: true },
]
