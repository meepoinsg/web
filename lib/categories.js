// 类别注册表：以后要加新类别（比如"购物"），只需要在这里加一条，
// 不需要去改地图图标逻辑、卡片逻辑、筛选逻辑里的每一处判断。
export const CATEGORIES = {
  restaurant: {
    key: "restaurant",
    label: "餐厅",
    labelEn: "Restaurant",
    icon: "🍽️",
    color: "#e0562f",
    featuresKey: "restaurantFeatures",
  },
  attraction: {
    key: "attraction",
    label: "景点",
    labelEn: "Attraction",
    icon: "📍",
    color: "#2563eb",
    featuresKey: "attractionFeatures",
  },
  // 以后加购物类别示例（先注释，真的要加的时候取消注释+建对应字段）：
  // shopping: {
  //   key: "shopping",
  //   label: "购物",
  //   labelEn: "Shopping",
  //   icon: "🛍️",
  //   color: "#16a34a",
  //   featuresKey: "shoppingFeatures",
  // },
};

export function getCategory(type) {
  return CATEGORIES[type] || CATEGORIES.attraction;
}

export function categoryLabel(type, lang) {
  const cat = getCategory(type);
  return lang === "en" ? cat.labelEn : cat.label;
}

// 给筛选栏用：所有类别的 {key, label} 列表，按当前语言显示
export function categoryOptions(lang) {
  return Object.values(CATEGORIES).map((c) => ({
    key: c.key,
    label: lang === "en" ? c.labelEn : c.label,
  }));
}
