<script setup>
import { computed, ref } from 'vue'
import TravelMap from './components/TravelMap.vue'
import VisitedPanel from './components/VisitedPanel.vue'

const visitedProvinces = ref([])
const hoveredPlace = ref(null)

const visitedCount = computed(() => visitedProvinces.value.length)

function toggleProvince(name) {
  const current = new Set(visitedProvinces.value)

  if (current.has(name)) {
    current.delete(name)
  } else {
    current.add(name)
  }

  visitedProvinces.value = Array.from(current)
}

function resetVisited() {
  visitedProvinces.value = []
}

function updateHoveredPlace(place) {
  hoveredPlace.value = place
}
</script>

<template>
  <div class="page-shell">
    <header class="hero">
      <div class="hero__content">
        <div class="hero__ink-wash"></div>
        <div class="hero__frame hero__frame--left"></div>
        <div class="hero__frame hero__frame--right"></div>
        <p class="hero__eyebrow">国风交互地图</p>
        <div class="hero__title-wrap">
          <h1 class="hero__title">跟着诗词去旅行</h1>
          <div class="hero__signature">
            <span class="hero__signature-text">诗路漫游</span>
            <span class="hero__seal">诗</span>
            <span class="hero__seal hero__seal--square">词</span>
          </div>
        </div>
        <div class="hero__inscription">
          <span class="hero__inscription-mark">题</span>
          <p class="hero__subtitle">
            以地形色带铺陈山河轮廓，在古地名与诗句之间，展开一幅可游可读的诗意中国地图。
          </p>
        </div>
      </div>
      <div class="hero__badge">地形底色版</div>
    </header>

    <main class="layout-grid">
      <section class="map-card">
        <TravelMap
          :visited-provinces="visitedProvinces"
          @toggle-province="toggleProvince"
          @hover-place="updateHoveredPlace"
        />
      </section>

      <VisitedPanel
        :visited-count="visitedCount"
        :visited-names="visitedProvinces"
        :hovered-place="hoveredPlace"
        @reset="resetVisited"
      />
    </main>
  </div>
</template>
