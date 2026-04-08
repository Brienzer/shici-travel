<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import chinaMap from 'china-map-geojson/lib/china'
import { getProvinceTooltipData } from '../data/shijingPlaces'
import { getProvinceFeatureCenter, getProvinceGeoFeatures } from '../data/provinceGeoMaps'
import {
  canDrilldownProvince,
  getRegionDisplayName,
  getRegionId,
  getRegionTooltipData
} from '../data/regionPlaces'

const props = defineProps({
  visitedRegions: {
    type: Array,
    required: true
  },
  focusedProvince: {
    type: String,
    default: ''
  },
  selectedRegion: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['select-province', 'hover-place', 'select-region'])

const mapRef = ref(null)
let chart

const provinceNames = [
  '北京', '天津', '上海', '重庆', '河北', '河南', '云南', '辽宁', '黑龙江', '湖南',
  '安徽', '山东', '新疆', '江苏', '浙江', '江西', '湖北', '广西', '甘肃', '山西',
  '内蒙古', '陕西', '吉林', '福建', '贵州', '广东', '青海', '西藏', '四川', '宁夏',
  '海南', '台湾', '香港', '澳门'
]

const terrainBands = {
  westHighland: new Set(['新疆', '西藏', '青海', '甘肃', '宁夏', '四川', '云南']),
  northPlateau: new Set(['内蒙古', '山西', '陕西', '贵州']),
  centralBasin: new Set(['重庆', '湖北', '湖南', '广西', '河南', '河北']),
  eastPlain: new Set(['北京', '天津', '上海', '江苏', '浙江', '安徽', '江西', '山东', '福建', '广东', '海南', '辽宁', '吉林', '黑龙江', '台湾', '香港', '澳门'])
}

const countryFeatureMap = Object.fromEntries(
  (chinaMap.features ?? []).map((feature) => [feature.properties?.name, feature])
)
const visitedRegionIdSet = computed(() => new Set(props.visitedRegions.map((item) => item.regionId)))
const visitedProvinceSet = computed(() => new Set(props.visitedRegions.map((item) => item.province)))
const focusedProvinceCenter = computed(() => getFeatureCenter(countryFeatureMap[props.focusedProvince]))
const selectedRegionCenter = computed(() => {
  if (!props.selectedRegion || props.selectedRegion.isMunicipality) {
    return null
  }

  return getProvinceFeatureCenter(props.selectedRegion.province, props.selectedRegion.regionName)
})

function getTerrainColor(name) {
  if (terrainBands.westHighland.has(name)) return '#8f7a53'
  if (terrainBands.northPlateau.has(name)) return '#b4976a'
  if (terrainBands.centralBasin.has(name)) return '#c9b77f'
  if (terrainBands.eastPlain.has(name)) return '#7fa36a'
  return '#aab58a'
}

function getFeatureCenter(feature) {
  const coordinates = feature?.geometry?.coordinates

  if (!coordinates) {
    return null
  }

  const polygons = feature.geometry.type === 'Polygon'
    ? [coordinates]
    : feature.geometry.type === 'MultiPolygon'
      ? coordinates
      : []

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

  if (!Number.isFinite(minX)) {
    return null
  }

  return [(minX + maxX) / 2, (minY + maxY) / 2]
}

function getGeoView() {
  if (selectedRegionCenter.value) {
    return {
      center: selectedRegionCenter.value,
      zoom: 4.4
    }
  }

  if (props.focusedProvince && focusedProvinceCenter.value) {
    return {
      center: focusedProvinceCenter.value,
      zoom: canDrilldownProvince(props.focusedProvince) ? 2.7 : 3.2
    }
  }

  return {
    center: null,
    zoom: 1.12
  }
}

function getCountryMapData() {
  const hasFocusedProvince = Boolean(props.focusedProvince)

  return provinceNames.map((name) => {
    const isFocused = props.focusedProvince === name
    const hasVisited = visitedProvinceSet.value.has(name)
    const isDimmed = hasFocusedProvince && !isFocused

    return {
      name,
      value: hasVisited ? 1 : 0,
      itemStyle: {
        areaColor: isFocused
          ? '#dbc391'
          : hasVisited
            ? '#2f6b62'
            : isDimmed
              ? 'rgba(190, 181, 164, 0.62)'
              : getTerrainColor(name),
        borderColor: isFocused ? '#8f6a3d' : hasVisited ? '#1f4f49' : '#f4ecd9',
        borderWidth: isFocused ? 2.8 : hasVisited ? 1.8 : 1.1,
        shadowBlur: isFocused ? 22 : 8,
        shadowColor: isFocused ? 'rgba(143, 106, 61, 0.24)' : 'rgba(78, 62, 37, 0.16)',
        shadowOffsetY: isFocused ? 8 : 4,
        opacity: isDimmed ? 0.86 : 1
      },
      emphasis: {
        itemStyle: {
          areaColor: isFocused ? '#e4ce9d' : hasVisited ? '#4a9187' : '#ddc68f',
          borderColor: '#8f6a3d',
          borderWidth: isFocused ? 2.8 : 1.6
        }
      }
    }
  })
}

function getRegionOverlayItems() {
  if (!props.focusedProvince || !canDrilldownProvince(props.focusedProvince)) {
    return []
  }

  return getProvinceGeoFeatures(props.focusedProvince)
    .map((feature) => {
      const regionName = feature.properties?.name ?? ''
      const place = getRegionTooltipData(props.focusedProvince, regionName)

      if (!regionName || !place) {
        return null
      }

      return {
        name: regionName,
        feature,
        place,
        center: getProvinceFeatureCenter(props.focusedProvince, regionName),
        isVisited: visitedRegionIdSet.value.has(getRegionId(props.focusedProvince, regionName)),
        isSelected: props.selectedRegion?.regionId === getRegionId(props.focusedProvince, regionName)
      }
    })
    .filter(Boolean)
}

function renderRegionOverlay(params, api, overlayItems) {
  const item = overlayItems[params.dataIndex]
  const coordinates = item?.feature?.geometry?.coordinates

  if (!item || !coordinates) {
    return null
  }

  const polygons = item.feature.geometry.type === 'Polygon'
    ? [coordinates]
    : item.feature.geometry.type === 'MultiPolygon'
      ? coordinates
      : []

  const children = polygons
    .map((polygon) => {
      const outerRing = polygon[0]

      if (!outerRing?.length) {
        return null
      }

      const points = outerRing
        .map((coord) => api.coord(coord))
        .filter((point) => Array.isArray(point) && Number.isFinite(point[0]) && Number.isFinite(point[1]))

      if (points.length < 3) {
        return null
      }

      return {
        type: 'polygon',
        shape: { points },
        style: {
          fill: item.isSelected
            ? 'rgba(47, 107, 98, 0.7)'
            : item.isVisited
              ? 'rgba(122, 147, 123, 0.52)'
              : 'rgba(226, 210, 172, 0.38)',
          stroke: item.isSelected ? '#1f4f49' : item.isVisited ? '#56775f' : '#8f6a3d',
          lineWidth: item.isSelected ? 2.6 : item.isVisited ? 1.9 : 1.2,
          shadowBlur: item.isSelected ? 18 : 8,
          shadowColor: item.isSelected ? 'rgba(47, 107, 98, 0.22)' : 'rgba(98, 74, 42, 0.12)',
          shadowOffsetY: 4
        },
        silent: false
      }
    })
    .filter(Boolean)

  if (!children.length) {
    return null
  }

  return {
    type: 'group',
    children,
    silent: false
  }
}

function getOption() {
  const geoView = getGeoView()
  const countryData = getCountryMapData()
  const overlayItems = getRegionOverlayItems()

  const series = [
    {
      id: 'china-base',
      type: 'map',
      geoIndex: 0,
      map: 'china',
      z: 2,
      data: countryData,
      itemStyle: {
        borderColor: '#f4ecd9',
        borderWidth: 1.1
      }
    }
  ]

  if (overlayItems.length) {
    series.push({
      id: 'region-overlay',
      name: 'region-overlay',
      type: 'custom',
      coordinateSystem: 'geo',
      z: 6,
      data: overlayItems.map((item) => ({
        name: item.name,
        value: item.center ?? [0, 0]
      })),
      renderItem: (params, api) => renderRegionOverlay(params, api, overlayItems),
      silent: false,
      tooltip: { show: false }
    })

    series.push({
      id: 'region-labels',
      type: 'scatter',
      coordinateSystem: 'geo',
      z: 7,
      silent: true,
      symbolSize: 1,
      itemStyle: {
        color: 'transparent'
      },
      label: {
        show: true,
        position: 'inside',
        formatter: ({ data }) => data.label,
        color: '#5d4124',
        fontSize: 13,
        fontWeight: 700,
        textBorderColor: 'rgba(255, 247, 233, 0.82)',
        textBorderWidth: 3
      },
      data: overlayItems
        .filter((item) => Array.isArray(item.center))
        .map((item) => ({
          name: item.name,
          value: item.center,
          label: item.place.displayName
        }))
    })
  }

  return {
    backgroundColor: 'transparent',
    tooltip: {
      show: false
    },
    geo: {
      map: 'china',
      roam: true,
      zoom: geoView.zoom,
      center: geoView.center,
      scaleLimit: {
        min: 1,
        max: 8
      },
      layoutCenter: ['50%', '56%'],
      layoutSize: '116%',
      label: {
        show: true,
        color: '#433424',
        fontSize: 11
      },
      itemStyle: {
        borderColor: '#f4ecd9',
        borderWidth: 1.1,
        areaColor: '#aab58a',
        shadowBlur: 16,
        shadowColor: 'rgba(82, 63, 32, 0.18)',
        shadowOffsetY: 6
      },
      emphasis: {
        label: {
          color: '#2b241c'
        },
        itemStyle: {
          areaColor: '#ddc68f'
        }
      },
      regions: countryData
    },
    series
  }
}

function ensureMap() {
  if (!echarts.getMap('china')) {
    echarts.registerMap('china', chinaMap)
  }
}

function renderChart() {
  ensureMap()

  if (!chart) {
    chart = echarts.init(mapRef.value)
    chart.on('click', (params) => {
      if (!params.name) {
        return
      }

      if (params.seriesId === 'region-overlay') {
        emit('select-region', params.name)
        return
      }

      emit('select-province', params.name)
    })
    chart.on('mouseover', (params) => {
      const place = params.seriesId === 'region-overlay'
        ? getRegionTooltipData(props.focusedProvince, params.name)
        : getProvinceTooltipData(params.name)

      emit('hover-place', place)
    })
    chart.on('mouseout', () => {
      emit('hover-place', null)
    })
    window.addEventListener('resize', resizeChart)
  }

  chart.setOption(getOption(), true)
}

function resizeChart() {
  chart?.resize()
}

onMounted(() => {
  renderChart()
})

watch(
  () => [
    props.focusedProvince,
    props.selectedRegion?.regionId ?? '',
    props.visitedRegions.map((item) => item.regionId).join('|')
  ],
  () => {
    renderChart()
  }
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chart?.dispose()
})
</script>

<template>
  <div class="travel-map-wrap">
    <div class="travel-map__ornament travel-map__ornament--left"></div>
    <div v-if="focusedProvince" class="travel-map__focus-tag">
      {{ canDrilldownProvince(focusedProvince) ? `${focusedProvince} · 原位聚焦` : `${focusedProvince} · 直辖地望` }}
    </div>
    <div ref="mapRef" class="travel-map"></div>
    <div class="travel-map__ornament travel-map__ornament--right"></div>
  </div>
</template>
