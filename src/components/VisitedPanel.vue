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
  activePlace: {
    type: Object,
    default: null
  },
  focusedProvince: {
    type: String,
    default: ''
  },
  selectedRegion: {
    type: Object,
    default: null
  },
  canDrilldown: {
    type: Boolean,
    default: false
  },
  poemDraft: {
    type: String,
    default: ''
  },
  savedPoem: {
    type: String,
    default: ''
  },
  activePlaceSavedPoem: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'reset',
  'exit-focus',
  'update-poem-draft',
  'save-poem',
  'clear-poem'
])

function handlePoemInput(event) {
  emit('update-poem-draft', event.target.value)
}
</script>

<template>
  <aside class="info-panel">
    <section class="info-card">
      <p class="info-card__eyebrow">行旅印记</p>
      <h2 class="info-card__number">{{ visitedCount }} 处</h2>
      <p class="info-card__desc">先点省份原位聚焦，再点具体地望，记录你真正到过的地方。</p>
      <button class="ghost-btn" @click="emit('reset')">清空行迹</button>
      <p v-if="visitedNames.length" class="visited-list">
        {{ visitedNames.join('、') }}
      </p>
      <p v-else class="empty-tip">还未落下你的第一枚地望足印。</p>
    </section>

    <section class="info-card poem-card">
      <div class="poem-card__header">
        <div>
          <p class="info-card__eyebrow">诗词地望</p>
          <p v-if="focusedProvince" class="poem-card__focus-tip">
            当前聚焦：{{ focusedProvince }}
          </p>
        </div>
        <button v-if="focusedProvince" class="ghost-btn ghost-btn--plain" @click="emit('exit-focus')">
          退出聚焦
        </button>
      </div>

      <template v-if="activePlace">
        <h3 class="poem-card__title">{{ activePlace.displayName ?? activePlace.ancientName ?? activePlace.landmark ?? activePlace.regionName ?? activePlace.province }}</h3>
        <p class="poem-card__meta">{{ activePlace.modernRef ?? `今 ${activePlace.regionName ?? activePlace.province}` }}</p>
        <p class="poem-card__meta">对应今 {{ activePlace.regionName ?? activePlace.province }}</p>
        <p v-if="activePlace.province && activePlace.regionName && !activePlace.isMunicipality" class="poem-card__meta">所属省份：{{ activePlace.province }}</p>
        <p v-if="activePlace.landmark" class="poem-card__meta">名胜：{{ activePlace.landmark }}</p>
        <div
          v-for="poem in activePlace.poems"
          :key="`${activePlace.regionId ?? activePlace.province}-${poem.title}`"
          class="poem-card__item"
        >
          <p class="poem-card__source">{{ poem.source }}</p>
          <p v-if="poem.author || poem.dynasty" class="poem-card__meta">
            {{ [poem.dynasty, poem.author].filter(Boolean).join('·') }}
          </p>
          <p class="poem-card__excerpt">{{ poem.excerpt }}</p>
        </div>
        <div v-if="activePlaceSavedPoem" class="poem-card__item poem-card__item--user">
          <p class="poem-card__source">你的题诗</p>
          <p class="poem-card__excerpt">{{ activePlaceSavedPoem }}</p>
        </div>
        <p v-if="!activePlace.poems?.length && !activePlaceSavedPoem" class="empty-tip">此地诗词条目仍在补充中。</p>
      </template>
      <p v-else class="empty-tip">悬浮到省份或二级区域后，右侧会显示对应诗词与题记。</p>

      <div v-if="focusedProvince && !canDrilldown" class="focus-note">
        直辖地望本次保持原位聚焦，不继续细分到区县。
      </div>

      <div v-if="selectedRegion" class="poem-editor">
        <p class="poem-editor__eyebrow">题诗留白</p>
        <textarea
          class="poem-editor__textarea"
          :value="poemDraft"
          :placeholder="selectedRegion.notePlaceholder"
          @input="handlePoemInput"
        ></textarea>
        <div class="poem-editor__actions">
          <button class="ghost-btn ghost-btn--ink" @click="emit('save-poem')">存入此地</button>
          <button class="ghost-btn ghost-btn--plain" @click="emit('clear-poem')">清空题诗</button>
        </div>
        <p v-if="savedPoem" class="poem-editor__saved">已为此地保存你的题诗。</p>
      </div>
    </section>
  </aside>
</template>
