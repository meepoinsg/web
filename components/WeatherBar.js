"use client";

import { useEffect, useState } from "react";

// 只挑几个游客常去的区域展示，key是data.gov.sg返回的area名字，value是显示用的中文标签
const AREAS_TO_SHOW = {
  City: "市中心/滨海湾",
  Tanglin: "乌节路",
  Sentosa: "圣淘沙",
  Bedok: "东海岸",
};

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

export default function WeatherBar() {
  const [state, setState] = useState({ status: "loading", items: [] });

  useEffect(() => {
    let cancelled = false;
    fetch("https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const record = json?.data?.items?.[0];
        const forecasts = record?.forecasts || [];
        const items = Object.entries(AREAS_TO_SHOW).map(([areaKey, label]) => {
          const found = forecasts.find((f) => f.area === areaKey);
          return {
            label,
            forecast: found ? found.forecast : "暂无数据",
            icon: found ? forecastToIcon(found.forecast) : "❓",
          };
        });
        setState({ status: "ok", items, updated: record?.valid_period?.text });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", items: [] });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "error") return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
      {state.status === "loading" &&
        [1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-24 h-14 rounded-xl bg-gray-100 animate-pulse"
          />
        ))}
      {state.status === "ok" &&
        state.items.map((it) => (
          <div
            key={it.label}
            className="flex-shrink-0 bg-white border border-[var(--line)] rounded-xl px-3 py-2 min-w-[96px]"
          >
            <div className="text-[11px] text-gray-500">{it.label}</div>
            <div className="text-sm mt-0.5">
              {it.icon} {it.forecast}
            </div>
          </div>
        ))}
    </div>
  );
}
