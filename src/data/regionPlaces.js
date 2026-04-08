import { getProvinceTooltipData } from './shijingPlaces'

export const directMunicipalitySet = new Set(['北京', '上海', '天津', '重庆'])

export const regionPlaceMap = {
  江苏: {
    南京市: { ancientName: '金陵', modernRef: '今江苏南京', poems: [{ title: '石头城', dynasty: '唐', author: '刘禹锡', source: '《石头城》·唐·刘禹锡', excerpt: '山围故国周遭在，潮打空城寂寞回。' }] },
    苏州市: { ancientName: '姑苏', modernRef: '今江苏苏州', poems: [{ title: '枫桥夜泊', dynasty: '唐', author: '张继', source: '《枫桥夜泊》·唐·张继', excerpt: '姑苏城外寒山寺，夜半钟声到客船。' }] },
    扬州市: { ancientName: '广陵', modernRef: '今江苏扬州', poems: [{ title: '黄鹤楼送孟浩然之广陵', dynasty: '唐', author: '李白', source: '《黄鹤楼送孟浩然之广陵》·唐·李白', excerpt: '故人西辞黄鹤楼，烟花三月下扬州。' }] },
    徐州市: { ancientName: '彭城', modernRef: '今江苏徐州' }
  },
  浙江: {
    杭州市: { ancientName: '临安', modernRef: '今浙江杭州', poems: [{ title: '饮湖上初晴后雨', dynasty: '宋', author: '苏轼', source: '《饮湖上初晴后雨》·宋·苏轼', excerpt: '欲把西湖比西子，淡妆浓抹总相宜。' }] },
    绍兴市: { ancientName: '会稽', modernRef: '今浙江绍兴' },
    宁波市: { ancientName: '明州', modernRef: '今浙江宁波' },
    温州市: { ancientName: '永嘉', modernRef: '今浙江温州' }
  },
  江西: {
    南昌市: { ancientName: '豫章', modernRef: '今江西南昌', poems: [{ title: '滕王阁诗', dynasty: '唐', author: '王勃', source: '《滕王阁诗》·唐·王勃', excerpt: '滕王高阁临江渚，佩玉鸣鸾罢歌舞。' }] },
    九江市: { ancientName: '浔阳', modernRef: '今江西九江', poems: [{ title: '琵琶行', dynasty: '唐', author: '白居易', source: '《琵琶行》·唐·白居易', excerpt: '浔阳江头夜送客，枫叶荻花秋瑟瑟。' }] },
    景德镇市: { ancientName: '昌南', modernRef: '今江西景德镇' },
    上饶市: { ancientName: '信州', modernRef: '今江西上饶' }
  },
  福建: {
    福州市: { ancientName: '三山', modernRef: '今福建福州' },
    泉州市: { ancientName: '刺桐', modernRef: '今福建泉州' },
    厦门市: { ancientName: '鹭门', modernRef: '今福建厦门' },
    漳州市: { ancientName: '龙溪', modernRef: '今福建漳州' }
  },
  山东: {
    济南市: { ancientName: '历城', modernRef: '今山东济南' },
    济宁市: { ancientName: '任城', modernRef: '今山东济宁' },
    泰安市: { ancientName: '泰安', modernRef: '今山东泰安', poems: [{ title: '望岳', dynasty: '唐', author: '杜甫', source: '《望岳》·唐·杜甫', excerpt: '会当凌绝顶，一览众山小。' }] },
    青岛市: { ancientName: '胶澳', modernRef: '今山东青岛' }
  },
  河南: {
    开封市: { ancientName: '汴京', modernRef: '今河南开封' },
    洛阳市: { ancientName: '洛阳', modernRef: '今河南洛阳', poems: [{ title: '洛桥晚望', dynasty: '唐', author: '孟郊', source: '《洛桥晚望》·唐·孟郊', excerpt: '天津桥下冰初结，洛阳陌上人行绝。' }] },
    南阳市: { ancientName: '宛', modernRef: '今河南南阳' },
    商丘市: { ancientName: '睢阳', modernRef: '今河南商丘' }
  },
  湖北: {
    武汉市: { ancientName: '江夏', modernRef: '今湖北武汉' },
    宜昌市: { ancientName: '夷陵', modernRef: '今湖北宜昌' },
    荆州市: { ancientName: '江陵', modernRef: '今湖北荆州' },
    襄阳市: { ancientName: '襄阳', modernRef: '今湖北襄阳' }
  },
  湖南: {
    长沙市: { ancientName: '星城', modernRef: '今湖南长沙' },
    岳阳市: { ancientName: '巴陵', modernRef: '今湖南岳阳', poems: [{ title: '登岳阳楼', dynasty: '唐', author: '杜甫', source: '《登岳阳楼》·唐·杜甫', excerpt: '吴楚东南坼，乾坤日夜浮。' }] },
    常德市: { ancientName: '武陵', modernRef: '今湖南常德' },
    永州市: { ancientName: '零陵', modernRef: '今湖南永州' }
  },
  安徽: {
    合肥市: { ancientName: '庐州', modernRef: '今安徽合肥' },
    芜湖市: { ancientName: '鸠兹', modernRef: '今安徽芜湖' },
    宣城市: { ancientName: '宛陵', modernRef: '今安徽宣城' },
    安庆市: { ancientName: '宜城', modernRef: '今安徽安庆' }
  },
  广东: {
    广州市: { ancientName: '羊城', modernRef: '今广东广州' },
    韶关市: { ancientName: '韶州', modernRef: '今广东韶关' },
    肇庆市: { ancientName: '端州', modernRef: '今广东肇庆' },
    潮州市: { ancientName: '潮州', modernRef: '今广东潮州' }
  },
  广西: {
    南宁市: { ancientName: '邕州', modernRef: '今广西南宁' },
    柳州市: { ancientName: '龙城', modernRef: '今广西柳州' },
    桂林市: { ancientName: '桂州', modernRef: '今广西桂林' },
    梧州市: { ancientName: '苍梧', modernRef: '今广西梧州' }
  },
  四川: {
    成都市: { ancientName: '锦官城', modernRef: '今四川成都', poems: [{ title: '春夜喜雨', dynasty: '唐', author: '杜甫', source: '《春夜喜雨》·唐·杜甫', excerpt: '晓看红湿处，花重锦官城。' }] },
    乐山市: { ancientName: '嘉州', modernRef: '今四川乐山' },
    宜宾市: { ancientName: '戎州', modernRef: '今四川宜宾' },
    绵阳市: { ancientName: '涪城', modernRef: '今四川绵阳' }
  },
  云南: {
    昆明市: { ancientName: '春城', modernRef: '今云南昆明' },
    大理白族自治州: { ancientName: '叶榆', modernRef: '今云南大理' },
    丽江市: { ancientName: '丽江', modernRef: '今云南丽江' },
    曲靖市: { ancientName: '曲州', modernRef: '今云南曲靖' }
  },
  陕西: {
    西安市: { ancientName: '长安', modernRef: '今陕西西安', poems: [{ title: '长安春望', dynasty: '唐', author: '卢纶', source: '《长安春望》·唐·卢纶', excerpt: '东风吹雨过青山，却望千门草色闲。' }] },
    咸阳市: { ancientName: '咸阳', modernRef: '今陕西咸阳' },
    宝鸡市: { ancientName: '陈仓', modernRef: '今陕西宝鸡' },
    汉中市: { ancientName: '南郑', modernRef: '今陕西汉中' }
  },
  山西: {
    太原市: { ancientName: '晋阳', modernRef: '今山西太原' },
    大同市: { ancientName: '云中', modernRef: '今山西大同' },
    运城市: { ancientName: '河东', modernRef: '今山西运城' },
    临汾市: { ancientName: '平阳', modernRef: '今山西临汾' }
  },
  河北: {
    石家庄市: { ancientName: '真定', modernRef: '今河北石家庄' },
    保定市: { ancientName: '上谷', modernRef: '今河北保定' },
    邯郸市: { ancientName: '邯郸', modernRef: '今河北邯郸' },
    承德市: { ancientName: '热河', modernRef: '今河北承德' }
  },
  辽宁: {
    沈阳市: { ancientName: '盛京', modernRef: '今辽宁沈阳' },
    锦州市: { ancientName: '锦州', modernRef: '今辽宁锦州' },
    丹东市: { ancientName: '安东', modernRef: '今辽宁丹东' },
    大连市: { ancientName: '青泥洼', modernRef: '今辽宁大连' }
  },
  甘肃: {
    兰州市: { ancientName: '金城', modernRef: '今甘肃兰州' },
    天水市: { ancientName: '秦州', modernRef: '今甘肃天水' },
    张掖市: { ancientName: '甘州', modernRef: '今甘肃张掖' },
    酒泉市: { ancientName: '肃州', modernRef: '今甘肃酒泉' }
  },
  新疆: {
    乌鲁木齐市: { ancientName: '迪化', modernRef: '今新疆乌鲁木齐' },
    喀什地区: { ancientName: '疏勒', modernRef: '今新疆喀什' },
    吐鲁番市: { ancientName: '高昌', modernRef: '今新疆吐鲁番' },
    伊犁哈萨克自治州: { ancientName: '伊宁', modernRef: '今新疆伊犁' }
  },
  宁夏: {
    银川市: { ancientName: '兴庆', modernRef: '今宁夏银川' },
    固原市: { ancientName: '原州', modernRef: '今宁夏固原' },
    吴忠市: { ancientName: '灵州', modernRef: '今宁夏吴忠' },
    中卫市: { ancientName: '沙州', modernRef: '今宁夏中卫' }
  },
  海南: {
    海口市: { ancientName: '琼山', modernRef: '今海南海口' },
    三亚市: { ancientName: '崖州', modernRef: '今海南三亚' },
    儋州市: { ancientName: '儋耳', modernRef: '今海南儋州' }
  },
  台湾: {
    台北市: { ancientName: '台北府', modernRef: '今台湾台北' },
    台南市: { ancientName: '赤崁', modernRef: '今台湾台南' },
    高雄市: { ancientName: '打狗', modernRef: '今台湾高雄' },
    台中市: { ancientName: '台中', modernRef: '今台湾台中' }
  },
  贵州: {
    贵阳市: { ancientName: '林城', modernRef: '今贵州贵阳' },
    遵义市: { ancientName: '播州', modernRef: '今贵州遵义' },
    铜仁市: { ancientName: '思州', modernRef: '今贵州铜仁' },
    安顺市: { ancientName: '安顺', modernRef: '今贵州安顺' }
  },
  青海: {
    西宁市: { ancientName: '青唐', modernRef: '今青海西宁' },
    海东市: { ancientName: '乐都', modernRef: '今青海海东' }
  },
  吉林: {
    吉林市: { ancientName: '船厂', modernRef: '今吉林吉林市' },
    延边朝鲜族自治州: { ancientName: '延边', modernRef: '今吉林延边' }
  },
  黑龙江: {
    哈尔滨市: { ancientName: '阿勒锦', modernRef: '今黑龙江哈尔滨' },
    齐齐哈尔市: { ancientName: '卜奎', modernRef: '今黑龙江齐齐哈尔' }
  },
  内蒙古: {
    呼和浩特市: { ancientName: '归绥', modernRef: '今内蒙古呼和浩特' },
    包头市: { ancientName: '九原', modernRef: '今内蒙古包头' },
    鄂尔多斯市: { ancientName: '伊克昭', modernRef: '今内蒙古鄂尔多斯' }
  },
  西藏: {
    拉萨市: { ancientName: '逻些', modernRef: '今西藏拉萨' },
    日喀则市: { ancientName: '后藏', modernRef: '今西藏日喀则' }
  }
}

export function isDirectMunicipality(province) {
  return directMunicipalitySet.has(province)
}

export function canDrilldownProvince(province) {
  return Boolean(province) && !isDirectMunicipality(province)
}

export function getRegionId(province, regionName = province) {
  return `${province}::${regionName}`
}

export function getRegionPlace(province, regionName = province) {
  return regionPlaceMap[province]?.[regionName] ?? null
}

export function getRegionTooltipData(province, regionName = province) {
  if (!province) {
    return null
  }

  const normalizedRegionName = regionName || province
  const provincePlace = getProvinceTooltipData(province)
  const regionPlace = getRegionPlace(province, normalizedRegionName)
  const isMunicipality = isDirectMunicipality(province) && normalizedRegionName === province
  const displayName = isMunicipality
    ? provincePlace?.ancientName ?? provincePlace?.landmark ?? province
    : regionPlace?.ancientName ?? normalizedRegionName

  return {
    type: 'region',
    regionId: getRegionId(province, normalizedRegionName),
    province,
    regionName: normalizedRegionName,
    displayName,
    ancientName: isMunicipality ? (provincePlace?.ancientName ?? '') : (regionPlace?.ancientName ?? ''),
    modernRef: isMunicipality
      ? (provincePlace?.modernRef ?? `今 ${province}`)
      : (regionPlace?.modernRef ?? `今 ${normalizedRegionName}`),
    landmark: regionPlace?.landmark ?? provincePlace?.landmark ?? '',
    poems: isMunicipality ? (provincePlace?.poems ?? []) : (regionPlace?.poems ?? []),
    tooltipArtwork: provincePlace?.tooltipArtwork ?? null,
    notePlaceholder: regionPlace?.notePlaceholder ?? `可在此写下你想留给${displayName}的诗词。`,
    isMunicipality
  }
}

export function getRegionDisplayName(province, regionName = province) {
  return getRegionTooltipData(province, regionName)?.displayName ?? regionName ?? province
}

export function buildVisitedRegionRecord(province, regionName = province) {
  const place = getRegionTooltipData(province, regionName)

  if (!place) {
    return null
  }

  return {
    regionId: place.regionId,
    province: place.province,
    regionName: place.regionName,
    displayName: place.displayName,
    ancientName: place.ancientName,
    modernRef: place.modernRef,
    isMunicipality: place.isMunicipality
  }
}
