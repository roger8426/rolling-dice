<template>
  <div>
    <!-- ─── Hero Section ─────────────────────────────────────────────────── -->
    <section
      class="relative flex max-h-screen flex-col items-center justify-center overflow-hidden"
    >
      <!-- Atmospheric background -->
      <div
        class="pointer-events-none absolute inset-0"
        style="
          background: radial-gradient(
            ellipse 70% 70% at 50% 50%,
            var(--rd--color-bg-elevated) 0%,
            var(--rd--color-bg) 100%
          );
        "
        aria-hidden="true"
      />

      <!-- Ring System -->
      <div class="ring-system scale-[0.5] sm:scale-[0.65] md:scale-[0.85] lg:scale-100">
        <!-- Center glow -->
        <div class="ring-glow" aria-hidden="true" />

        <!-- Outer ring (clockwise, 7 professions) -->
        <div
          v-for="(prof, i) in OUTER_RING_PROFESSIONS"
          :key="`outer-${prof}`"
          class="orbit-outer"
          :style="{ '--i': i }"
        >
          <img :src="professionImages[prof]" :alt="PROFESSION_NAMES[prof]" class="ring-img" />
        </div>

        <!-- Inner ring (counter-clockwise, 6 professions) -->
        <div
          v-for="(prof, i) in INNER_RING_PROFESSIONS"
          :key="`inner-${prof}`"
          class="orbit-inner"
          :style="{ '--i': i }"
        >
          <img :src="professionImages[prof]" :alt="PROFESSION_NAMES[prof]" class="ring-img" />
        </div>

        <!-- Center content -->
        <div class="ring-center">
          <h1 class="font-display text-4xl font-bold tracking-widest text-content sm:text-5xl">
            Rolling Dice
          </h1>
          <p class="mt-2 text-sm tracking-wider text-content-muted">塑造你的冒險者</p>
        </div>
      </div>

      <!-- Scroll indicator -->
      <!-- <div
        class="absolute bottom-8 flex flex-col items-center gap-2 text-content-faint"
        aria-hidden="true"
      >
        <span class="text-xs tracking-wider">探索更多</span>
        <Icon name="chevron-down" :size="20" class="animate-bounce motion-reduce:animate-none" />
      </div> -->
    </section>

    <!-- ─── Features Section ──────────────────────────────────────────────── -->
    <!-- <section class="bg-canvas-muted py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 class="mb-12 text-center font-display text-2xl font-bold text-content sm:text-3xl">
          開始你的冒險
        </h2>
        <div class="grid gap-6 md:grid-cols-3">
          <Card v-for="feature in features" :key="feature.title" shadow="md" :radius="12">
            <div class="flex flex-col items-center gap-4 p-2 text-center">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft">
                <Icon :name="feature.icon" :size="22" :color="`var(--rd--color-accent)`" />
              </div>
              <h3 class="font-semibold text-content">{{ feature.title }}</h3>
              <p class="text-sm text-content-muted">{{ feature.description }}</p>
            </div>
          </Card>
        </div>
      </div>
    </section> -->

    <!-- ─── Professions Grid Section ─────────────────────────────────────── -->
    <!-- <section class="py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 class="mb-12 text-center font-display text-2xl font-bold text-content sm:text-3xl">
          選擇你的職業
        </h2>
        <div class="grid grid-cols-4 gap-6 sm:grid-cols-7">
          <div v-for="prof in ALL_PROFESSIONS" :key="prof" class="flex flex-col items-center gap-2">
            <div
              class="overflow-hidden rounded-full border-2 border-surface-3 transition-transform hover:scale-110 hover:border-accent"
            >
              <img
                :src="professionImages[prof]"
                :alt="PROFESSION_NAMES[prof]"
                class="h-16 w-16 object-cover"
              />
            </div>
            <span class="text-center text-xs text-content-muted">{{ PROFESSION_NAMES[prof] }}</span>
          </div>
        </div>
      </div>
    </section> -->

    <!-- ─── Bottom Banner ────────────────────────────────────────────────── -->
    <!-- <section class="banner-section relative overflow-hidden py-24">
      <div class="absolute inset-0 bg-canvas/85" aria-hidden="true" />
      <div class="relative mx-auto max-w-2xl px-4 text-center">
        <p
          class="font-display text-3xl font-bold leading-snug tracking-wider text-content sm:text-4xl"
        >
          每一顆骰子的背後<br />都是一個等待被訴說的故事
        </p>
        <p class="mt-4 text-content-muted">透過上方導覽列開始建立你的角色</p>
      </div>
    </section> -->
  </div>
</template>

<script setup lang="ts">
// import { Card, Icon } from '@ui'

// ─── Image assets ─────────────────────────────────────────────────────────────
// import: 'default' 告訴 Vite 直接回傳 default export（asset URL 字串），而非模組物件
const imageModules = import.meta.glob<string>('../assets/images/professions/*.png', {
  eager: true,
  import: 'default',
})

console.log(imageModules)

const professionImages: Record<string, string> = Object.fromEntries(
  Object.entries(imageModules).map(([path, url]) => {
    const key = path.split('/').pop()!.replace('.png', '')
    console.log('Loaded image:', key, url)

    return [key, url]
  }),
)

// ─── Feature cards ────────────────────────────────────────────────────────────
// const features = [
//   {
//     icon: 'search',
//     title: '探索職業',
//     description:
//       '從 13 種職業中，找到最符合你冒險風格的角色定位，每種職業都有獨特的技能與戰鬥方式。',
//   },
//   {
//     icon: 'user',
//     title: '塑造角色',
//     description: '自由分配能力值、選擇種族背景，一步步建立屬於你的獨特冒險者。',
//   },
//   {
//     icon: 'check',
//     title: '踏上旅程',
//     description: '完成角色建立，帶著你的角色卡進入桌遊世界，讓每個選擇都成為故事的一部分。',
//   },
// ]
</script>

<style scoped>
/* ─── Ring System ──────────────────────────────────────────────────────────── */
.ring-system {
  position: relative;
  width: 600px;
  height: 600px;
  flex-shrink: 0;
}

/* ─── Center glow ──────────────────────────────────────────────────────────── */
.ring-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(ellipse at center, var(--rd--color-accent-soft) 0%, transparent 70%);
  pointer-events: none;
}

/* ─── Outer ring (clockwise, 7 items, radius 220px) ───────────────────────── */
@keyframes orbit-outer {
  from {
    transform: rotate(0deg) translateY(-220px) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateY(-220px) rotate(-360deg);
  }
}

.orbit-outer {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 64px;
  height: 64px;
  margin-top: -32px;
  margin-left: -32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid var(--rd--color-accent);
  box-shadow: 0 0 10px var(--rd--color-accent-soft);
  padding: 5px;
  animation: orbit-outer 40s linear infinite;
  animation-delay: calc(var(--i) / 7 * -40s);
}

/* ─── Inner ring (counter-clockwise, 6 items, radius 130px) ───────────────── */
@keyframes orbit-inner {
  from {
    transform: rotate(0deg) translateY(-130px) rotate(0deg);
  }
  to {
    transform: rotate(-360deg) translateY(-130px) rotate(360deg);
  }
}

.orbit-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 52px;
  height: 52px;
  margin-top: -26px;
  margin-left: -26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid var(--rd--color-border-strong);
  padding: 4px;
  animation: orbit-inner 30s linear infinite;
  animation-delay: calc(var(--i) / 6 * -30s);
}

/* ─── Ring images ──────────────────────────────────────────────────────────── */
.ring-img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: fill;
}

/* ─── Ring center ──────────────────────────────────────────────────────────── */
.ring-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  pointer-events: none;
  white-space: nowrap;
}

/* ─── Bottom banner background ─────────────────────────────────────────────── */
.banner-section {
  background-image: url('../assets/images/professions/professions.jpg');
  background-size: cover;
  background-position: center;
}

/* ─── Reduced motion ───────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .orbit-outer {
    animation: none;
    transform: rotate(calc(var(--i) * (360deg / 7))) translateY(-220px)
      rotate(calc(var(--i) * (-360deg / 7)));
  }

  .orbit-inner {
    animation: none;
    transform: rotate(calc(var(--i) * (360deg / 6))) translateY(-130px)
      rotate(calc(var(--i) * (-360deg / 6)));
  }
}
</style>
