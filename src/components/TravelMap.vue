<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import chinaMap from 'china-map-geojson/lib/china'
import { getProvinceTooltipData } from '../data/shijingPlaces'

const props = defineProps({
  visitedProvinces: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['toggle-province', 'hover-place'])

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

function getTerrainColor(name) {
  if (terrainBands.westHighland.has(name)) return '#8f7a53'
  if (terrainBands.northPlateau.has(name)) return '#b4976a'
  if (terrainBands.centralBasin.has(name)) return '#c9b77f'
  if (terrainBands.eastPlain.has(name)) return '#7fa36a'
  return '#aab58a'
}

const mapData = computed(() => provinceNames.map((name) => ({
  name,
  value: props.visitedProvinces.includes(name) ? 1 : 0,
  itemStyle: {
    areaColor: props.visitedProvinces.includes(name) ? '#2f6b62' : getTerrainColor(name),
    shadowBlur: 8,
    shadowColor: 'rgba(78, 62, 37, 0.16)',
    shadowOffsetY: 4
  },
  emphasis: {
    itemStyle: {
      areaColor: props.visitedProvinces.includes(name) ? '#3d8177' : '#d7c08f'
    }
  }
})))

function buildTooltip(params) {
  const place = getProvinceTooltipData(params.name)

  if (!place) {
    return ''
  }

  const poems = (place.poems ?? []).map((poem) => `
    <div class="map-tooltip__poem">
      <div class="map-tooltip__source">${poem.source}</div>
      <div class="map-tooltip__excerpt">${poem.excerpt}</div>
    </div>
  `).join('')

  const artworkStyle = place.tooltipArtwork
    ? ` style="--tooltip-art: url('${place.tooltipArtwork}')"`
    : ''

  return `
    <div class="map-tooltip map-tooltip--poem"${artworkStyle}>
      <div class="map-tooltip__bg"></div>
      <div class="map-tooltip__mask"></div>
      <div class="map-tooltip__content">
        ${place.landmark ? `<div class="map-tooltip__landmark">${place.landmark}</div>` : ''}
        <div class="map-tooltip__ancient">${place.ancientName ?? place.landmark ?? place.province}</div>
        <div class="map-tooltip__modern">${place.modernRef ?? `今 ${place.province}`}</div>
        <div class="map-tooltip__name">今 ${place.province}</div>
        ${poems || '<div class="map-tooltip__plain">此地暂未录入代表诗词。</div>'}
      </div>
    </div>
  `
}

function getOption() {
  const terrainRegions = mapData.value.map((item) => ({
    ...item,
    itemStyle: {
      ...item.itemStyle,
      borderColor: props.visitedProvinces.includes(item.name) ? '#1f4f49' : '#f4ecd9',
      borderWidth: props.visitedProvinces.includes(item.name) ? 1.8 : 1.1
    },
    emphasis: {
      itemStyle: {
        areaColor: props.visitedProvinces.includes(item.name) ? '#4a9187' : '#ddc68f',
        borderColor: '#8f6a3d',
        borderWidth: 1.6
      }
    }
  }))

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      enterable: true,
      borderWidth: 0,
      backgroundColor: 'rgba(0,0,0,0)',
      formatter: buildTooltip,
      extraCssText: 'box-shadow:none;padding:0;background:transparent;'
    },
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.12,
      scaleLimit: {
        min: 1,
        max: 6
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
      regions: terrainRegions
    },
    series: [
      {
        type: 'map',
        geoIndex: 0,
        map: 'china',
        z: 3,
        data: terrainRegions,
        itemStyle: {
          borderColor: '#f4ecd9',
          borderWidth: 1.1
        }
      }
    ]
  }
}

function ensureMap() {
  if (echarts.getMap('china')) {
    return
  }

  echarts.registerMap('china', chinaMap)
}

async function renderChart() {
  ensureMap()

  if (!chart) {
    chart = echarts.init(mapRef.value)
    chart.on('click', (params) => {
      if (params.name) {
        emit('toggle-province', params.name)
      }
    })
    chart.on('mouseover', (params) => {
      emit('hover-place', getProvinceTooltipData(params.name))
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

watch(() => props.visitedProvinces, () => {
  renderChart()
}, { deep: true })

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chart?.dispose()
})
</script>

<template>
  <div class="travel-map-wrap">
    <div class="travel-map__ornament travel-map__ornament--left"></div>
    <div ref="mapRef" class="travel-map"></div>
    <div class="travel-map__ornament travel-map__ornament--right"></div>
  </div>
</template>
