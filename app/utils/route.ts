/** 從 route.params 安全取出單一字串值（陣列時取第一項） */
export function getRouteParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}
