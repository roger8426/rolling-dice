const imageModules = import.meta.glob<string>('../assets/images/professions/*.png', {
  eager: true,
  import: 'default',
})

export function getProfessionImages(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(imageModules).map(([path, url]) => {
      const key = path.split('/').pop()!.replace('.png', '')
      return [key, url]
    }),
  )
}
