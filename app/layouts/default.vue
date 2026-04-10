<template>
  <div class="flex min-h-screen flex-col bg-canvas text-content">
    <LayoutLoadingOverlay />
    <LayoutHeader />
    <LayoutMobileMenu />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>
