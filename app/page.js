"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import places from "../data/places.json";
import TagFilter from "../components/TagFilter";
import ViewToggle from "../components/ViewToggle";
import PlaceCard from "../components/PlaceCard";
import PlaceModal from "../components/PlaceModal";
import { categoryOptions } from "../lib/categories";
import { TAGS, localize } from "../lib/vocab";
import { t, localizeField } from "../lib/i18n";

// Leaflet 依赖 window/document，必须禁用SSR，只在浏览器端加载
const MapView = dynamic(() => import("../components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[70vh] rounded-2xl bg-gray-100 animate-pulse" />
  ),
});

const WeatherMapModal = dynamic(() => import("../components/WeatherMapModal"), {
  ssr: false,
});

export default function Home() {
  const [view, setView] = useState("list");
  const [activeFilter, setActiveFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [openPlace, setOpenPlace] = useState(null);
  const [showWeather, setShowWeather] = useState(false);
  const [lang, setLang] = useState("zh");

  // 记住用户上次选的语言，下次打开网站不用重新切换
  useEffect(() => {
    const saved = typeof window !== "undefined" && window.localStorage.getItem("sgps-lang");
    if (saved === "en" || saved === "zh") setLang(saved);
  }, []);

  function toggleLang() {
    const next = lang === "zh" ? "en" : "zh";
    setLang(next);
    if (typeof window !== "undefined") window.localStorage.setItem("sgps-lang", next);
  }

  // 筛选项都用canonical key存状态（比如"restaurant"、"trending"），
  // 显示文字才按当前语言查词典——这样切换语言时筛选状态不会丢。
  const filterOptions = useMemo(() => {
    const tagKeySet = new Set();
    places.forEach((p) => (p.tags || []).forEach((k) => tagKeySet.add(k)));
    return [
      { key: "all", label: t(lang, "filterAll") },
      ...categoryOptions(lang),
      ...Array.from(tagKeySet).map((k) => ({ key: k, label: localize(TAGS, k, lang) })),
    ];
  }, [lang]);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const isCategoryKey = activeFilter === "restaurant" || activeFilter === "attraction";
    return places.filter((p) => {
      let filterOk = true;
      if (activeFilter !== "all") {
        filterOk = isCategoryKey ? p.type === activeFilter : (p.tags || []).includes(activeFilter);
      }

      const description = localizeField(p, "description", lang) || "";
      const kwOk =
        !kw ||
        `${p.name} ${p.nameCn} ${description}`
          .toLowerCase()
          .includes(kw);

      return filterOk && kwOk;
    });
  }, [activeFilter, keyword, lang]);

  return (
    <main className="max-w-3xl mx-auto pb-10">
      <div className="sticky top-0 bg-[var(--bg)] z-20 px-4 pt-4 pb-2 border-b border-[var(--line)]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h1 className="text-xl font-semibold m-0">{t(lang, "siteTitle")}</h1>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowWeather(true)}
              className="text-xs bg-white border border-[var(--line)] rounded-full px-3 py-1.5 flex items-center gap-1"
            >
              {t(lang, "weatherButton")}
            </button>
            <button
              onClick={toggleLang}
              className="text-xs bg-white border border-[var(--line)] rounded-full px-3 py-1.5 font-medium"
            >
              {t(lang, "langToggle")}
            </button>
          </div>
        </div>

        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={t(lang, "searchPlaceholder")}
          className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--line)] text-sm mb-3"
        />

        <div className="flex items-center justify-between gap-3">
          <TagFilter options={filterOptions} active={activeFilter} onChange={setActiveFilter} />
        </div>
        <div className="mt-3">
          <ViewToggle view={view} onChange={setView} lang={lang} />
        </div>
      </div>

      <div className="px-4 pt-4">
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-16 text-sm">{t(lang, "noResults")}</p>
        )}

        {view === "list" && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((p) => (
              <PlaceCard key={p.id} place={p} onOpen={setOpenPlace} lang={lang} />
            ))}
          </div>
        )}

        {view === "map" && <MapView places={filtered} onOpen={setOpenPlace} lang={lang} />}
      </div>

      {openPlace && <PlaceModal place={openPlace} onClose={() => setOpenPlace(null)} lang={lang} />}
      {showWeather && <WeatherMapModal onClose={() => setShowWeather(false)} lang={lang} />}
    </main>
  );
}
