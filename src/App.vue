<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import TravelMap from './components/TravelMap.vue'
import VisitedPanel from './components/VisitedPanel.vue'
import { getProvinceTooltipData } from './data/shijingPlaces'

const visitedProvinces = ref([])
const hoveredPlace = ref(null)
const provinceMist = ref({
  visible: false,
  phase: 'idle',
  province: '',
  displayName: '',
  runId: 0
})

const mistTimers = []
const visitedCount = computed(() => visitedProvinces.value.length)

function clearMistTimers() {
  mistTimers.splice(0).forEach((timer) => window.clearTimeout(timer))
}

function playProvinceMist(name) {
  const place = getProvinceTooltipData(name)
  const displayName = place?.ancientName ?? place?.landmark ?? name

  clearMistTimers()

  provinceMist.value = {
    visible: true,
    phase: 'condense',
    province: name,
    displayName,
    runId: provinceMist.value.runId + 1
  }

  mistTimers.push(
    window.setTimeout(() => {
      provinceMist.value = {
        ...provinceMist.value,
        phase: 'hold'
      }
    }, 700)
  )

  mistTimers.push(
    window.setTimeout(() => {
      provinceMist.value = {
        ...provinceMist.value,
        phase: 'disperse'
      }
    }, 3700)
  )

  mistTimers.push(
    window.setTimeout(() => {
      provinceMist.value = {
        ...provinceMist.value,
        visible: false,
        phase: 'idle'
      }
    }, 4600)
  )
}

function toggleProvince(name) {
  const current = new Set(visitedProvinces.value)
  const isVisiting = !current.has(name)

  if (current.has(name)) {
    current.delete(name)
  } else {
    current.add(name)
  }

  visitedProvinces.value = Array.from(current)

  if (isVisiting) {
    playProvinceMist(name)
  }
}

function resetVisited() {
  visitedProvinces.value = []
}

function updateHoveredPlace(place) {
  hoveredPlace.value = place
}

onBeforeUnmount(() => {
  clearMistTimers()
})
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

    <transition name="province-mist-fade">
      <div
        v-if="provinceMist.visible"
        :key="provinceMist.runId"
        class="province-mist-overlay"
        :class="`is-${provinceMist.phase}`"
      >
        <div class="province-mist-overlay__veil"></div>
        <div class="province-mist-overlay__fog province-mist-overlay__fog--left"></div>
        <div class="province-mist-overlay__fog province-mist-overlay__fog--right"></div>
        <div class="province-mist-overlay__core"></div>
        <div class="province-mist-overlay__text-wrap">
          <div class="province-mist-overlay__province">今 {{ provinceMist.province }}</div>
          <div class="province-mist-overlay__text">{{ provinceMist.displayName }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>
