"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { X } from "lucide-react";

// data.gov.sg 2小时天气预报接口的area名字 -> 中文地名。
// 只翻译了游客/本地人比较熟悉的区域，不确定的生僻区域（工业区、军事区等）
// 就留空，界面上会自动显示英文原名，不瞎编中文名。
const AREA_NAME_CN = {
  "Ang Mo Kio": "宏茂桥",
  Bedok: "勿洛",
  Bishan: "碧山",
  "Boon Lay": "文礼",
  "Bukit Batok": "武吉巴督",
  "Bukit Merah": "红山",
  "Bukit Panjang": "武吉班让",
  "Bukit Timah": "武吉知马",
  "Central Water Catchment": "中央集水区",
  Changi: "樟宜",
  "Choa Chu Kang": "蔡厝港",
  City: "市中心",
  Clementi: "金文泰",
  Geylang: "芽笼",
  Hougang: "后港",
  "Jurong East": "裕廊东",
  "Jurong Island": "裕廊岛",
  "Jurong West": "裕廊西",
  Kallang: "加冷",
  "Lim Chu Kang": "林厝港",
  "Marine Parade": "马林百列",
  Novena: "诺维娜",
  "Pasir Ris": "巴西立",
  "Paya Lebar": "巴耶利峇",
  Pioneer: "先驱",
  "Pulau Tekong": "德光岛",
  "Pulau Ubin": "乌敏岛",
  Punggol: "榜鹅",
  Queenstown: "女皇镇",
  Seletar: "实里达",
  Sembawang: "三巴旺",
  Sengkang: "盛港",
  Sentosa: "圣淘沙",
  Serangoon: "实龙岗",
  "Southern Islands": "南部离岛",
  "Sungei Kadut": "双溪加株",
  Tampines: "淡滨尼",
  Tanglin: "东陵",
  Tengah: "登加",
  "Toa Payoh": "大巴窑",
  Tuas: "大士",
  "Western Islands": "西部离岛",
  "Western Water Catchment": "西部集水区",
  Woodlands: "兀兰",
  Yishun: "义顺",
};

const SINGAPORE_CENTER = [1.3521, 103.8198];
const SINGAPORE_BOUNDS = [
  [1.13, 103.55],
  [1.49, 104.15],
];

function forecastToIcon(forecast) {
  const f = (forecast || "").toLowerCase();
  if (f.includes("thundery")) return "⛈️";
  if (f.includes("heavy") && (f.includes("rain") || f.includes("shower"))) return "🌧️";
  if (f.includes("shower") || f.includes("rain") || f.includes("drizzle")) return "🌦️";
  if (f.includes("cloudy") && f.includes("partly")) return "⛅";
  if (f.includes("cloudy") || f.includes("overcast")) return "☁️";
  if (f.includes("fair") || f.includes("sunny") || f.includes("clear")) return "☀️";
  if (f.includes("hazy") || f.includes("mist") || f.includes("fog")) return "🌫️";
  return "🌤️";
}

function weatherIcon(emoji) {
  return L.divIcon({
    html: `<div style="background:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;border:1.5px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,.25);">${emoji}</div>`,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

export default function WeatherMapModal({ onClose }) {
  const [state, setState] = useState({ status: "loading", points: [] });

  useEffect(() => {
    let cancelled = false;
    fetch("https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const metadata = json?.data?.area_metadata || [];
        const record = json?.data?.items?.[0];
        const forecasts = record?.forecasts || [];

        const points = metadata
          .map((m) => {
            const found = forecasts.find((f) => f.area === m.name);
            return {
              name: m.name,
              nameCn: AREA_NAME_CN[m.name] || null,
              lat: m.label_location?.latitude,
              lng: m.label_location?.longitude,
              forecast: found ? found.forecast : null,
              icon: found ? forecastToIcon(found.forecast) : "❓",
            };
          })
          .filter((p) => typeof p.lat === "number" && typeof p.lng === "number");

        setState({ status: "ok", points, updated: record?.valid_period?.text });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", points: [] });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/55 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-hidden relative flex flex-col">
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-[var(--line)]">
          <div>
            <h2 className="text-base font-semibold m-0">🇸🇬 新加坡全岛实时天气</h2>
            <p className="text-xs text-gray-500 m-0 mt-0.5">
              {state.status === "ok" && state.updated ? `预报时段：${state.updated}` : "data.gov.sg 2小时天气预报"}
            </p>
          </div>
          <button
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 min-h-[60vh]">
          {state.status === "loading" && (
            <div className="h-full min-h-[60vh] flex items-center justify-center text-sm text-gray-400">
              加载天气数据中...
            </div>
          )}
          {state.status === "error" && (
            <div className="h-full min-h-[60vh] flex items-center justify-center text-sm text-gray-400 px-8 text-center">
              天气数据暂时加载失败，请稍后再试
            </div>
          )}
          {state.status === "ok" && (
            <MapContainer
              center={SINGAPORE_CENTER}
              zoom={11}
              minZoom={10}
              maxZoom={14}
              maxBounds={SINGAPORE_BOUNDS}
              maxBoundsViscosity={1.0}
              scrollWheelZoom={true}
              style={{ height: "100%", minHeight: "60vh", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {state.points.map((p) => (
                <Marker key={p.name} position={[p.lat, p.lng]} icon={weatherIcon(p.icon)}>
                  <Popup>
                    <div style={{ fontSize: 13 }}>
                      <strong>{p.nameCn || p.name}</strong>
                      {p.nameCn && (
                        <div style={{ fontSize: 11, color: "#6b7280" }}>{p.name}</div>
                      )}
                      <div style={{ marginTop: 4 }}>
                        {p.icon} {p.forecast || "暂无数据"}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
}
