// 词汇词典：把"能反复出现的中文短语"（标签、菜系、氛围、座位、
// 适合人群、设施、景点分类）统一变成一个key，中英文各写一次存在这里。
// 好处：中英文永远不会对不上——因为压根没有两份平行文本，只有一份词典。
// 这个文件既会被 React 组件 import 使用，也会被 scripts/build-places.js
// 用 require() 读取做校验，所以用 CommonJS 写（module.exports），
// Next.js 的打包器可以正常把它当具名 import 用。

const TAGS = {
  trending: { zh: "网红", en: "Trending" },
  "night-view": { zh: "夜景", en: "Night View" },
  free: { zh: "免费", en: "Free" },
  "indoor-shelter": { zh: "室内避雨", en: "Indoor / Rain Shelter" },
  "hidden-gem": { zh: "小众", en: "Hidden Gem" },
  family: { zh: "亲子家庭", en: "Family-friendly" },
  cycling: { zh: "骑行", en: "Cycling" },
  "yacht-charter": { zh: "游艇出海", en: "Yacht Charter" },
  "sea-bbq": { zh: "海上BBQ", en: "Sea BBQ" },
  "team-gathering": { zh: "团队聚会", en: "Team Gathering" },
  "lazarus-island": { zh: "拉扎鲁斯岛", en: "Lazarus Island" },
  "water-activities": { zh: "水上活动", en: "Water Activities" },
  hiking: { zh: "徒步", en: "Hiking" },
  nature: { zh: "自然", en: "Nature" },
  outdoor: { zh: "户外", en: "Outdoor" },
  wildlife: { zh: "野生动物", en: "Wildlife" },
  scenery: { zh: "自然风光", en: "Scenic Nature" },
  zoo: { zh: "动物园", en: "Zoo" },
  "eco-friendly": { zh: "环保设施", en: "Eco-friendly Facilities" },
  "night-activity": { zh: "夜间活动", en: "Night Activity" },
  "unique-experience": { zh: "特色体验", en: "Unique Experience" },
  "outdoor-adventure": { zh: "户外探险", en: "Outdoor Adventure" },
  "newly-opened": { zh: "最新开幕", en: "Newly Opened" },
  "date-spot": { zh: "情侣约会", en: "Date Spot" },
  "unesco-heritage": { zh: "世界文化遗产", en: "UNESCO World Heritage" },
  "hainanese-chicken-rice": { zh: "海南鸡饭", en: "Hainanese Chicken Rice" },
  "old-school-flavor": { zh: "古早味", en: "Old-school Flavor" },
  "budget-friendly": { zh: "平价", en: "Budget-friendly" },
  "heritage-brand": { zh: "老字号", en: "Heritage Brand" },
  "near-mrt": { zh: "近地铁", en: "Near MRT" },
  "hawker-centre": { zh: "小贩中心", en: "Hawker Centre" },
  "sea-view": { zh: "海景", en: "Sea View" },
  "bbq-seafood": { zh: "烧烤海鲜", en: "BBQ Seafood" },
  satay: { zh: "沙嗲", en: "Satay" },
  "budget-eats": { zh: "平价美食", en: "Budget Eats" },
  "frog-porridge": { zh: "田鸡粥", en: "Frog Porridge" },
  "late-night-supper": { zh: "宵夜", en: "Late-night Supper" },
  seafood: { zh: "海鲜", en: "Seafood" },
  "zi-char": { zh: "煮炒", en: "Zi Char" },
  "sky-view": { zh: "高空观景", en: "Sky-high View" },
  "italian-cuisine": { zh: "意式料理", en: "Italian Cuisine" },
  "rooftop-bar": { zh: "天台酒吧", en: "Rooftop Bar" },
  "romantic-date": { zh: "浪漫约会", en: "Romantic Date" },
  "indian-cuisine": { zh: "印度菜", en: "Indian Cuisine" },
  "banana-leaf-rice": { zh: "芭蕉叶饭", en: "Banana Leaf Rice" },
  "fish-head-curry": { zh: "咖喱鱼头", en: "Fish Head Curry" },
  dempsey: { zh: "Dempsey", en: "Dempsey" },
  "pet-friendly": { zh: "宠物友好", en: "Pet-friendly" },
  beach: { zh: "沙滩", en: "Beach" },
  "romantic-sunset": { zh: "浪漫日落", en: "Romantic Sunset" },
  "alfresco-bar": { zh: "露天餐吧", en: "Alfresco Bar" },
  crab: { zh: "螃蟹", en: "Crab" },
};

const CUISINE = {
  "sg-cuisine": { zh: "新加坡菜", en: "Singaporean" },
  chinese: { zh: "中式", en: "Chinese" },
  "hainanese-chicken-rice": { zh: "海南鸡饭", en: "Hainanese Chicken Rice" },
  seafood: { zh: "海鲜", en: "Seafood" },
  "hawker-food": { zh: "小贩美食", en: "Hawker Food" },
  bbq: { zh: "烧烤", en: "BBQ" },
  "zi-char": { zh: "煮炒", en: "Zi Char" },
  "frog-porridge": { zh: "田鸡粥", en: "Frog Porridge" },
  italian: { zh: "意式料理", en: "Italian" },
  "american-italian": { zh: "美式意菜", en: "American-Italian" },
  indian: { zh: "印度菜", en: "Indian" },
  "south-indian": { zh: "南印度菜", en: "South Indian" },
  curry: { zh: "咖喱", en: "Curry" },
  western: { zh: "西餐", en: "Western" },
  cocktails: { zh: "鸡尾酒", en: "Cocktails" },
  thai: { zh: "泰式", en: "Thai" },
};

const ATMOSPHERE = {
  "nostalgic-retro": { zh: "怀旧复古", en: "Nostalgic & Retro" },
  "family-dining": { zh: "家庭聚餐", en: "Family Dining" },
  "casual-everyday": { zh: "日常简餐", en: "Casual Everyday Meal" },
  "alfresco-seaview": { zh: "海景露天", en: "Alfresco Sea View" },
  relaxed: { zh: "休闲放松", en: "Relaxed" },
  "lively-local": { zh: "烟火气", en: "Lively & Local" },
  "supper-stall": { zh: "宵夜档", en: "Supper Spot" },
  "street-food-stall": { zh: "大排档", en: "Street-food Style" },
  "sky-high": { zh: "高空观景", en: "Sky-high View" },
  romantic: { zh: "浪漫约会", en: "Romantic" },
  "chic-bar": { zh: "时尚酒吧", en: "Chic Bar" },
  "business-dining": { zh: "商务宴请", en: "Business Dining" },
  "retro-heritage": { zh: "复古老字号", en: "Retro Heritage" },
  "laid-back": { zh: "休闲随性", en: "Laid-back" },
  "couples-date": { zh: "情侣约会", en: "Couples' Date" },
  "friends-gathering": { zh: "朋友聚餐", en: "Friends Gathering" },
  "sea-view-dining": { zh: "海景观景", en: "Sea View Dining" },
  "bustling-local": { zh: "市井烟火气", en: "Bustling Local Vibe" },
  "friends-meetup": { zh: "朋友聚会", en: "Friends Meetup" },
};

const SEATING_OPTIONS = {
  "indoor-aircon": { zh: "室内空调", en: "Indoor (Air-conditioned)" },
  "outdoor-alfresco": { zh: "室外露天", en: "Outdoor / Alfresco" },
  "covered-outdoor": { zh: "带顶棚室外座位", en: "Covered Outdoor Seating" },
  "indoor-fan": { zh: "室内（风扇区）", en: "Indoor (Fan-cooled)" },
  "waterfront-terrace": { zh: "海滨露台", en: "Waterfront Terrace" },
  "beach-sofa": { zh: "沙滩沙发", en: "Beach Sofa Seating" },
};

const SUITABLE_FOR = {
  family: { zh: "亲子家庭", en: "Families" },
  "family-older-kids": { zh: "亲子家庭（大龄儿童）", en: "Families (older kids)" },
  couples: { zh: "情侣约会", en: "Couples" },
  photographers: { zh: "摄影爱好者", en: "Photography Lovers" },
  seniors: { zh: "适合带长辈", en: "Good for Seniors" },
  "sports-lovers": { zh: "运动爱好者", en: "Sports Lovers" },
  "team-outings": { zh: "团队聚会", en: "Team Outings" },
  "corporate-teambuilding": { zh: "公司团建", en: "Corporate Team-building" },
  "friends-party": { zh: "朋友派对", en: "Friends' Party" },
  "outdoor-sports-lovers": { zh: "户外运动爱好者", en: "Outdoor Sports Lovers" },
  "nature-lovers": { zh: "自然爱好者", en: "Nature Lovers" },
  "adventure-lovers": { zh: "户外探险爱好者", en: "Adventure Lovers" },
  "joggers-hikers": { zh: "晨跑与徒步者", en: "Joggers & Hikers" },
};

const FACILITIES = {
  "wheelchair-access": { zh: "无障碍轮椅通道", en: "Wheelchair Access" },
  "stroller-friendly": { zh: "婴儿车友好", en: "Stroller-friendly" },
  "luggage-storage": { zh: "行李寄存", en: "Luggage Storage" },
  "bike-rental": { zh: "自行车租赁", en: "Bike Rental" },
  "public-restroom": { zh: "公共厕所", en: "Public Restroom" },
  "bbq-pit-rental": { zh: "烧烤场地租借", en: "BBQ Pit Rental" },
  "indoor-aircon-lounge": { zh: "室内空调休息区", en: "Indoor A/C Lounge" },
  "onboard-ktv-sound": { zh: "船上KTV/音响系统", en: "Onboard KTV/Sound System" },
  "bbq-facilities": { zh: "BBQ烧烤设施", en: "BBQ Facilities" },
  "fridge-cooler": { zh: "冰箱/冷藏柜", en: "Fridge/Cooler" },
  "shower-toilet": { zh: "淋浴与卫生间", en: "Shower & Toilet" },
  "changing-room": { zh: "客舱更衣室", en: "Changing Room" },
  restroom: { zh: "洗手间", en: "Restroom" },
  "water-refill": { zh: "直饮水机", en: "Water Refill Station" },
  "lockers-south-entrance": { zh: "储物柜(南部入口处)", en: "Lockers (South Entrance)" },
  "shower-south-entrance": { zh: "淋浴间(南部入口处)", en: "Shower (South Entrance)" },
  "free-shuttle": { zh: "免费游园车", en: "Free Shuttle Tram" },
  "free-water-refill": { zh: "免费直饮水机", en: "Free Water Refill Station" },
  "onsite-dining": { zh: "内部餐厅", en: "On-site Dining" },
  "dining-facilities": { zh: "餐饮设施", en: "Dining Facilities" },
  "covered-walkway": { zh: "带顶棚步道", en: "Covered Walkway" },
  "indoor-cool-zone": { zh: "室内避暑区域", en: "Indoor Cool Zone" },
  "wheelchair-access-partial": { zh: "无障碍通道 (部分基础步道)", en: "Wheelchair Access (select trails)" },
  "free-shuttle-east-west": { zh: "免费游园接驳车 (连接东西两区)", en: "Free Shuttle (East-West zones)" },
  "adventure-safety-gear": { zh: "探险装备安全设施", en: "Adventure Safety Gear" },
  "dining-facilities-named": { zh: "餐饮设施 (如 Watering Hole Cafe)", en: "Dining (e.g. Watering Hole Cafe)" },
  lockers: { zh: "储物柜", en: "Lockers" },
  "stroller-fold-required": { zh: "婴儿车需折叠上船", en: "Strollers must be folded onboard" },
  "wheelchair-access-boat": {
    zh: "无障碍轮椅通道（部分船型支持，建议提前联系确认）",
    en: "Wheelchair Access (select boats, call ahead to confirm)",
  },
  "direct-mrt-access": { zh: "直达地铁站 (Botanic Gardens MRT)", en: "Direct MRT Access (Botanic Gardens)" },
  "restroom-water-onsite": { zh: "园内洗手间与直饮水设施", en: "Restrooms & Water Points Onsite" },
};

const SUB_CATEGORY = {
  "nature-theme-park": { zh: "自然风光/主题公园", en: "Nature / Theme Park" },
  "park-outdoor-sports": { zh: "公园/户外运动", en: "Park / Outdoor Sports" },
  "yacht-water-experience": { zh: "海上游艇/水上体验", en: "Yacht / Water Experience" },
  "nature-hiking": { zh: "自然风光/徒步", en: "Nature / Hiking" },
  "river-cruise-sightseeing": { zh: "游船/观光", en: "River Cruise / Sightseeing" },
  "nature-park": { zh: "自然风光/公园", en: "Nature / Park" },
};

const WEATHER_ADAPT = {
  indoor: { zh: "室内", en: "Indoor" },
  outdoor: { zh: "户外", en: "Outdoor" },
  mixed: { zh: "室内外皆宜", en: "Indoor & Outdoor" },
};

// 根据key查词典，找不到就直接把key原样显示出来（不报错、不留空）
function localize(dict, key, lang) {
  if (!key) return null;
  const entry = dict[key];
  if (!entry) return key;
  return lang === "en" ? entry.en || entry.zh : entry.zh;
}

// 一组key -> 一组本地化后的文字
function localizeList(dict, keys, lang) {
  if (!Array.isArray(keys)) return [];
  return keys.map((k) => localize(dict, k, lang));
}

module.exports = {
  TAGS,
  CUISINE,
  ATMOSPHERE,
  SEATING_OPTIONS,
  SUITABLE_FOR,
  FACILITIES,
  SUB_CATEGORY,
  WEATHER_ADAPT,
  localize,
  localizeList,
};
