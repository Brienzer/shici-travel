<script setup>
const props = defineProps({
  visitedCount: {
    type: Number,
    required: true
  },
  visitedNames: {
    type: Array,
    required: true
  },
  hoveredPlace: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['reset'])
</script>

<template>
  <aside class="info-panel">
    <section class="info-card">
      <p class="info-card__eyebrow">行旅印记</p>
      <h2 class="info-card__number">{{ visitedCount }} 处</h2>
      <p class="info-card__desc">点击地图上的省份，可切换“已去过”状态。</p>
      <button class="ghost-btn" @click="emit('reset')">清空行迹</button>
      <p v-if="visitedNames.length" class="visited-list">
        {{ visitedNames.join('、') }}
      </p>
      <p v-else class="empty-tip">还未落下你的第一枚足印。</p>
    </section>

    <section class="info-card poem-card">
      <p class="info-card__eyebrow">诗词地望</p>
      <template v-if="hoveredPlace">
        <h3 class="poem-card__title">{{ hoveredPlace.ancientName ?? hoveredPlace.landmark ?? hoveredPlace.province }}</h3>
        <p class="poem-card__meta">{{ hoveredPlace.modernRef ?? `今 ${hoveredPlace.province}` }}</p>
        <p class="poem-card__meta">对应今 {{ hoveredPlace.province }}</p>
        <p v-if="hoveredPlace.landmark" class="poem-card__meta">名胜：{{ hoveredPlace.landmark }}</p>
        <div
          v-for="poem in hoveredPlace.poems"
          :key="`${hoveredPlace.province}-${poem.title}`"
          class="poem-card__item"
        >
          <p class="poem-card__source">{{ poem.source }}</p>
          <p v-if="poem.author || poem.dynasty" class="poem-card__meta">
            {{ [poem.dynasty, poem.author].filter(Boolean).join('·') }}
          </p>
          <p class="poem-card__excerpt">{{ poem.excerpt }}</p>
        </div>
        <p v-if="!hoveredPlace.poems?.length" class="empty-tip">此地诗词条目仍在补充中。</p>
      </template>
      <p v-else class="empty-tip">悬浮到任一省份，即可在此查看对应地望、名胜与诗词。</p>
    </section>
  </aside>
</template>
