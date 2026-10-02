"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCategory, categoryLabel } from "../lib/categories";
import { t } from "../lib/i18n";

const SINGAPORE_CENTER = [1.3521, 103.8198];

// 餐厅按 recommendBin 显示不同材质的刀叉图标：bin3=木质（无光泽），
// bin2=银色（金属渐变），bin1=金色（金属渐变+更亮的高光），直观对应推荐优先级。
const BIN_ICON_STYLE = {
  bin1: { gradient: ["#fffbe6", "#ffe066", "#ffd700", "#c99700", "#8a6d00"], stroke: "#7a5c00" },
  bin2: { gradient: ["#ffffff", "#e4e4e4", "#c6c6c6", "#9a9a9a", "#707070"], stroke: "#5a5a5a" },
  bin3: { gradient: ["#d7a66d", "#b98a56", "#a97c50", "#8f6640", "#7a5230"], stroke: "#5c3a1e" },
};

// 刀叉交叉图标（Material Design "restaurant" 图标的 path）
const CUTLERY_PATH =
  "M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z";

function cutlerySvg(bin, uid) {
  const style = BIN_ICON_STYLE[bin] || BIN_ICON_STYLE.bin3;
  const gradId = `cutlery-grad-${uid}`;
  const stops = style.gradient
    .map((color, i) => `<stop offset="${(i / (style.gradient.length - 1)) * 100}%" stop-color="${color}" />`)
    .join("");
  return `
    <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">${stops}</linearGradient>
      </defs>
      <path d="${CUTLERY_PATH}" fill="url(#${gradId})" stroke="${style.stroke}" stroke-width="0.6" />
    </svg>`;
}

function makeIcon(place) {
  const cat = getCategory(place.type);

  if (place.type === "restaurant") {
    const bin = (place.restaurantFeatures && place.restaurantFeatures.recommendBin) || "bin3";
    const glyph = cutlerySvg(bin, place.id);
    return L.divIcon({
      html: `<div style="background:${cat.color};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.35);">${glyph}</div>`,
      className: "",
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16],
    });
  }

  return L.divIcon({
    html: `<div style="background:${cat.color};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.35);">${cat.icon}</div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

export default function MapView({ places, onOpen, lang = "zh" }) {
  return (
    <div className="h-[70vh] rounded-2xl overflow-hidden border border-[var(--line)]">
      <MapContainer center={SINGAPORE_CENTER} zoom={12} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places
          .filter((p) => Array.isArray(p.coordinates) && p.coordinates.length === 2)
          .map((p) => {
            const primaryName = lang === "en" ? p.name : p.nameCn || p.name;
            const bin = p.restaurantFeatures && p.restaurantFeatures.recommendBin;
            return (
              <Marker key={p.id} position={p.coordinates} icon={makeIcon(p)}>
                <Popup>
                  <div style={{ width: 160 }}>
                    <strong>{primaryName}</strong>
                    <div style={{ fontSize: 12, color: "#6b7280", margin: "4px 0" }}>
                      {categoryLabel(p.type, lang)} · {p.area}
                      {p.rating ? ` · ⭐${p.rating}` : ""}
                      {bin ? ` · ${bin[0].toUpperCase() + bin.slice(1)}` : ""}
                    </div>
                    <button
                      style={{
                        fontSize: 13,
                        color: "#e0562f",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                      }}
                      onClick={() => onOpen(p)}
                    >
                      {t(lang, "mapPopupOpen")}
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}
