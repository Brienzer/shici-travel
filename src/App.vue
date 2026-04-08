<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import chinaMap from 'china-map-geojson/lib/china'
import TravelMap from './components/TravelMap.vue'
import VisitedPanel from './components/VisitedPanel.vue'
import { getProvinceTooltipData } from './data/shijingPlaces'
import {
  buildVisitedRegionRecord,
  canDrilldownProvince,
  getRegionTooltipData,
  isDirectMunicipality
} from './data/regionPlaces'

const REGION_NOTE_STORAGE_KEY = 'poetry-travel:region-notes'

const focusedProvince = ref('')
const hoveredPlace = ref(null)
const selectedRegion = ref(null)
const poemDraft = ref('')
const regionNotes = ref({})
const visitedRegions = ref([])
const provinceMist = ref({
  visible: false,
  phase: 'idle',
  province: '',
  displayName: '',
  outlinePath: '',
  runId: 0
})

const mistTimers = []
const canDrilldownFocusedProvince = computed(() => canDrilldownProvince(focusedProvince.value))
const visitedCount = computed(() => visitedRegions.value.length)
const visitedNames = computed(() => visitedRegions.value.map((item) => (
  item.isMunicipality ? item.displayName : `${item.displayName}（${item.province}）`
)))
const selectedRegionSavedPoem = computed(() => {
  if (!selectedRegion.value) {
    return ''
  }

  return regionNotes.value[selectedRegion.value.regionId] ?? ''
})
const activePlace = computed(() => {
  if (hoveredPlace.value) {
    return hoveredPlace.value
  }

  if (selectedRegion.value) {
    return selectedRegion.value
  }

  if (focusedProvince.value) {
    const place = getProvinceTooltipData(focusedProvince.value)

    return place
      ? {
          ...place,
          type: 'province',
          displayName: place.ancientName ?? place.landmark ?? place.province
        }
      : null
  }

  return null
})
const activePlaceSavedPoem = computed(() => {
  const regionId = activePlace.value?.regionId
  return regionId ? (regionNotes.value[regionId] ?? '') : ''
})

const provinceFeatureMap = Object.fromEntries(
  (chinaMap.features ?? []).map((feature) => [feature.properties?.name, feature])
)

function projectRing(points, bounds) {
  const scale = 86 / Math.max(bounds.width, bounds.height, 0.0001)
  const offsetX = (100 - bounds.width * scale) / 2
  const offsetY = (100 - bounds.height * scale) / 2

  return points.map(([x, y], index) => {
    const px = (x - bounds.minX) * scale + offsetX
    const py = (bounds.maxY - y) * scale + offsetY
    return `${index === 0 ? 'M' : 'L'} ${px.toFixed(2)} ${py.toFixed(2)}`
  }).join(' ')
}

function getProvinceOutlinePath(name) {
  const feature = provinceFeatureMap[name]
  const coordinates = feature?.geometry?.coordinates

  if (!feature || !coordinates) {
    return ''
  }

  const polygons = feature.geometry.type === 'Polygon'
    ? [coordinates]
    : feature.geometry.type === 'MultiPolygon'
      ? coordinates
      : []

  if (!polygons.length) {
    return ''
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  polygons.forEach((polygon) => {
    polygon[0]?.forEach(([x, y]) => {
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    })
  })

  const bounds = {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  }

  return polygons
    .map((polygon) => {
      const outerRing = polygon[0]

      if (!outerRing?.length) {
        return ''
      }

      return `${projectRing(outerRing, bounds)} Z`
    })
    .filter(Boolean)
    .join(' ')
}

function clearMistTimers() {
  mistTimers.splice(0).forEach((timer) => window.clearTimeout(timer))
}

function playProvinceMist(name) {
  const place = getProvinceTooltipData(name)
  const displayName = place?.ancientName ?? place?.landmark ?? name
  const outlinePath = getProvinceOutlinePath(name)

  clearMistTimers()

  provinceMist.value = {
    visible: true,
    phase: 'condense',
    province: name,
    displayName,
    outlinePath,
    runId: provinceMist.value.runId + 1
  }

  mistTimers.push(window.setTimeout(() => {
    provinceMist.value = {
      ...provinceMist.value,
      phase: 'hold'
    }
  }, 900))

  mistTimers.push(window.setTimeout(() => {
    provinceMist.value = {
      ...provinceMist.value,
      phase: 'disperse'
    }
  }, 3900))

  mistTimers.push(window.setTimeout(() => {
    provinceMist.value = {
      ...provinceMist.value,
      visible: false,
      phase: 'idle'
    }
  }, 5000))
}

function readRegionNotes() {
  try {
    const raw = window.localStorage.getItem(REGION_NOTE_STORAGE_KEY)

    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeRegionNotes(notes) {
  window.localStorage.setItem(REGION_NOTE_STORAGE_KEY, JSON.stringify(notes))
}

function addVisitedRegion(province, regionName = province) {
  const record = buildVisitedRegionRecord(province, regionName)

  if (!record) {
    return
  }

  if (visitedRegions.value.some((item) => item.regionId === record.regionId)) {
    return
  }

  visitedRegions.value = [...visitedRegions.value, record]
}

function toggleVisitedRegion(province, regionName = province) {
  const record = buildVisitedRegionRecord(province, regionName)

  if (!record) {
    return
  }

  if (visitedRegions.value.some((item) => item.regionId === record.regionId)) {
    visitedRegions.value = visitedRegions.value.filter((item) => item.regionId !== record.regionId)
    return
  }

  visitedRegions.value = [...visitedRegions.value, record]
}

function selectProvince(name) {
  focusedProvince.value = name
  hoveredPlace.value = getProvinceTooltipData(name)
  selectedRegion.value = null
  playProvinceMist(name)

  if (isDirectMunicipality(name)) {
    selectedRegion.value = getRegionTooltipData(name, name)
    hoveredPlace.value = selectedRegion.value
    addVisitedRegion(name, name)
  }
}

function selectRegion(regionName) {
  if (!focusedProvince.value) {
    return
  }

  const regionPlace = getRegionTooltipData(focusedProvince.value, regionName)

  if (!regionPlace) {
    return
  }

  selectedRegion.value = regionPlace
  hoveredPlace.value = regionPlace
  toggleVisitedRegion(focusedProvince.value, regionName)
}

function exitProvinceFocus() {
  focusedProvince.value = ''
  selectedRegion.value = null
  hoveredPlace.value = null
  poemDraft.value = ''
}

function resetVisited() {
  visitedRegions.value = []
}

function updateHoveredPlace(place) {
  hoveredPlace.value = place
}

function updatePoemDraft(value) {
  poemDraft.value = value
}

function saveSelectedRegionPoem() {
  if (!selectedRegion.value) {
    return
  }

  regionNotes.value = {
    ...regionNotes.value,
    [selectedRegion.value.regionId]: poemDraft.value.trim()
  }
}

function clearSelectedRegionPoem() {
  if (!selectedRegion.value) {
    return
  }

  const nextNotes = { ...regionNotes.value }
  delete nextNotes[selectedRegion.value.regionId]
  regionNotes.value = nextNotes
  poemDraft.value = ''
}

watch(
  () => selectedRegion.value?.regionId ?? '',
  () => {
    poemDraft.value = selectedRegionSavedPoem.value
  },
  { immediate: true }
)

watch(regionNotes, (value) => {
  writeRegionNotes(value)
}, { deep: true })

onMounted(() => {
  regionNotes.value = readRegionNotes()
})

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
      <div class="hero__badge">地望原位聚焦版</div>
    </header>

    <main class="layout-grid">
      <section class="map-card" :class="{ 'map-card--focused': focusedProvince }">
        <TravelMap
          :visited-regions="visitedRegions"
          :focused-province="focusedProvince"
          :selected-region="selectedRegion"
          @select-province="selectProvince"
          @hover-place="updateHoveredPlace"
          @select-region="selectRegion"
        />
      </section>

      <VisitedPanel
        :visited-count="visitedCount"
        :visited-names="visitedNames"
        :active-place="activePlace"
        :focused-province="focusedProvince"
        :selected-region="selectedRegion"
        :can-drilldown="canDrilldownFocusedProvince"
        :poem-draft="poemDraft"
        :saved-poem="selectedRegionSavedPoem"
        :active-place-saved-poem="activePlaceSavedPoem"
        @reset="resetVisited"
        @exit-focus="exitProvinceFocus"
        @update-poem-draft="updatePoemDraft"
        @save-poem="saveSelectedRegionPoem"
        @clear-poem="clearSelectedRegionPoem"
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
        <div class="province-mist-overlay__figure">
          <svg
            v-if="provinceMist.outlinePath"
            class="province-mist-overlay__outline"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <path class="province-mist-overlay__outline-shadow" :d="provinceMist.outlinePath" />
            <path class="province-mist-overlay__outline-fill" :d="provinceMist.outlinePath" />
            <path class="province-mist-overlay__outline-stroke" :d="provinceMist.outlinePath" />
          </svg>
          <div class="province-mist-overlay__text-wrap">
            <div class="province-mist-overlay__province">今 {{ provinceMist.province }}</div>
            <div class="province-mist-overlay__text">{{ provinceMist.displayName }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
