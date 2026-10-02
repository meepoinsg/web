// 餐厅推荐Bin（bin1/bin2/bin3）对应的刀叉图标（金/银/木材质）。
// MapView（地图图钉）和 PlaceCard（列表卡片角标）共用这一份，
// 避免图标画法写两份代码、以后改样式要同时改两个文件、容易改漏。
const BIN_ICON_STYLE = {
  bin1: { gradient: ["#fffbe6", "#ffe066", "#ffd700", "#c99700", "#8a6d00"], stroke: "#7a5c00" },
  bin2: { gradient: ["#ffffff", "#e4e4e4", "#c6c6c6", "#9a9a9a", "#707070"], stroke: "#5a5a5a" },
  bin3: { gradient: ["#d7a66d", "#b98a56", "#a97c50", "#8f6640", "#7a5230"], stroke: "#5c3a1e" },
};

// 刀叉交叉图标（Material Design "restaurant" 图标的 path）
const CUTLERY_PATH =
  "M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z";

// uid 用来生成不重复的渐变id（同一页面可能同时渲染很多个这个svg，比如地图上
// 一堆图钉、列表里一堆卡片，渐变id重复虽然大多数浏览器也能正常显示，但规范上
// 每个id应该唯一，所以调用时传地点的 place.id 进来拼一下）。
function cutlerySvg(bin, uid, size = 15) {
  const style = BIN_ICON_STYLE[bin] || BIN_ICON_STYLE.bin3;
  const gradId = `cutlery-grad-${uid}`;
  const stops = style.gradient
    .map((color, i) => `<stop offset="${(i / (style.gradient.length - 1)) * 100}%" stop-color="${color}" />`)
    .join("");
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">${stops}</linearGradient>
      </defs>
      <path d="${CUTLERY_PATH}" fill="url(#${gradId})" stroke="${style.stroke}" stroke-width="0.6" />
    </svg>`;
}

module.exports = { BIN_ICON_STYLE, CUTLERY_PATH, cutlerySvg };
