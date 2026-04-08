import anHuiGeo from 'china-map-geojson/lib/province/an_hui_geo'
import aoMenGeo from 'china-map-geojson/lib/province/ao_men_geo'
import beiJingGeo from 'china-map-geojson/lib/province/bei_jing_geo'
import chongQingGeo from 'china-map-geojson/lib/province/chong_qing_geo'
import fuJianGeo from 'china-map-geojson/lib/province/fu_jian_geo'
import ganSuGeo from 'china-map-geojson/lib/province/gan_su_geo'
import guangDongGeo from 'china-map-geojson/lib/province/guang_dong_geo'
import guangXiGeo from 'china-map-geojson/lib/province/guang_xi_geo'
import guiZhouGeo from 'china-map-geojson/lib/province/gui_zhou_geo'
import haiNanGeo from 'china-map-geojson/lib/province/hai_nan_geo'
import heBeiGeo from 'china-map-geojson/lib/province/he_bei_geo'
import heNanGeo from 'china-map-geojson/lib/province/he_nan_geo'
import heiLongJiangGeo from 'china-map-geojson/lib/province/hei_long_jiang_geo'
import huBeiGeo from 'china-map-geojson/lib/province/hu_bei_geo'
import huNanGeo from 'china-map-geojson/lib/province/hu_nan_geo'
import jiLinGeo from 'china-map-geojson/lib/province/ji_lin_geo'
import jiangSuGeo from 'china-map-geojson/lib/province/jiang_su_geo'
import jiangXiGeo from 'china-map-geojson/lib/province/jiang_xi_geo'
import liaoNingGeo from 'china-map-geojson/lib/province/liao_ning_geo'
import neiMengGuGeo from 'china-map-geojson/lib/province/nei_meng_gu_geo'
import ningXiaGeo from 'china-map-geojson/lib/province/ning_xia_geo'
import qingHaiGeo from 'china-map-geojson/lib/province/qing_hai_geo'
import shanDongGeo from 'china-map-geojson/lib/province/shan_dong_geo'
import shanXiGeo from 'china-map-geojson/lib/province/shan_xi_1_geo'
import shanXi3Geo from 'china-map-geojson/lib/province/shan_xi_3_geo'
import shangHaiGeo from 'china-map-geojson/lib/province/shang_hai_geo'
import siChuanGeo from 'china-map-geojson/lib/province/si_chuan_geo'
import taiWanGeo from 'china-map-geojson/lib/province/tai_wan_geo'
import tianJinGeo from 'china-map-geojson/lib/province/tian_jin_geo'
import xiZangGeo from 'china-map-geojson/lib/province/xi_zang_geo'
import xiangGangGeo from 'china-map-geojson/lib/province/xiang_gang_geo'
import xinJiangGeo from 'china-map-geojson/lib/province/xin_jiang_geo'
import yunNanGeo from 'china-map-geojson/lib/province/yun_nan_geo'
import zheJiangGeo from 'china-map-geojson/lib/province/zhe_jiang_geo'

export const provinceGeoMapModules = {
  安徽: anHuiGeo,
  澳门: aoMenGeo,
  北京: beiJingGeo,
  重庆: chongQingGeo,
  福建: fuJianGeo,
  甘肃: ganSuGeo,
  广东: guangDongGeo,
  广西: guangXiGeo,
  贵州: guiZhouGeo,
  海南: haiNanGeo,
  河北: heBeiGeo,
  河南: heNanGeo,
  黑龙江: heiLongJiangGeo,
  湖北: huBeiGeo,
  湖南: huNanGeo,
  吉林: jiLinGeo,
  江苏: jiangSuGeo,
  江西: jiangXiGeo,
  辽宁: liaoNingGeo,
  内蒙古: neiMengGuGeo,
  宁夏: ningXiaGeo,
  青海: qingHaiGeo,
  山东: shanDongGeo,
  山西: shanXiGeo,
  陕西: shanXi3Geo,
  上海: shangHaiGeo,
  四川: siChuanGeo,
  台湾: taiWanGeo,
  天津: tianJinGeo,
  西藏: xiZangGeo,
  香港: xiangGangGeo,
  新疆: xinJiangGeo,
  云南: yunNanGeo,
  浙江: zheJiangGeo
}

export function getProvinceGeoData(province) {
  return provinceGeoMapModules[province] ?? null
}

export function getProvinceMapName(province) {
  return province ? `province-${province}` : ''
}

export function getProvinceGeoFeatures(province) {
  return getProvinceGeoData(province)?.features ?? []
}

export function getProvinceGeoFeature(province, regionName) {
  return getProvinceGeoFeatures(province).find((feature) => feature.properties?.name === regionName) ?? null
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

export function getProvinceFeatureCenter(province, regionName) {
  return getFeatureCenter(getProvinceGeoFeature(province, regionName))
}
