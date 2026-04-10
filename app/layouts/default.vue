<template>
  <div class="flex min-h-screen flex-col bg-canvas text-content">
    <LayoutLoadingOverlay />
    <LayoutHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutBottomNavDrawer />
    <LayoutFooter />
  </div>
</template>
