// 类别注册表：以后要加新类别（比如"购物"），只需要在这里加一条，
// 不需要去改地图图标逻辑、卡片逻辑、筛选逻辑里的每一处判断。
export const CATEGORIES = {
  restaurant: {
    key: "restaurant",
    label: "餐厅",
    icon: "🍽️",
    color: "#e0562f",
    featuresKey: "restaurantFeatures",
  },
  attraction: {
    key: "attraction",
    label: "景点",
    icon: "📍",
    color: "#2563eb",
    featuresKey: "attractionFeatures",
  },
  // 以后加购物类别示例（先注释，真的要加的时候取消注释+建对应字段）：
  // shopping: {
  //   key: "shopping",
  //   label: "购物",
  //   icon: "🛍️",
  //   color: "#16a34a",
  //   featuresKey: "shoppingFeatures",
  // },
};

export function getCategory(type) {
  return CATEGORIES[type] || CATEGORIES.attraction;
}

export function allCategoryLabels() {
  return Object.values(CATEGORIES).map((c) => c.label);
}

export function categoryKeyByLabel(label) {
  const found = Object.values(CATEGORIES).find((c) => c.label === label);
  return found ? found.key : null;
}
