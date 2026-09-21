"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import places from "../data/places.json";
import WeatherBar from "../components/WeatherBar";
import TagFilter from "../components/TagFilter";
import ViewToggle from "../components/ViewToggle";
import PlaceCard from "../components/PlaceCard";
import PlaceModal from "../components/PlaceModal";

// Leaflet 依赖 window/document，必须禁用SSR，只在浏览器端加载
const MapView = dynamic(() => import("../components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[70vh] rounded-2xl bg-gray-100 animate-pulse" />
  ),
});

export default function Home() {
  const [view, setView] = useState("list");
  const [activeFilter, setActiveFilter] = useState("全部");
  const [keyword, setKeyword] = useState("");
  const [modal, setModal] = useState(null); // { place, tab }

  const filterOptions = useMemo(() => {
    const tagSet = new Set();
    places.forEach((p) => (p.tags || []).forEach((t) => tagSet.add(t)));
    return ["全部", "餐厅", "景点", ...Array.from(tagSet)];
  }, []);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return places.filter((p) => {
      let filterOk = true;
      if (activeFilter === "餐厅") filterOk = p.type === "restaurant";
      else if (activeFilter === "景点") filterOk = p.type === "attraction";
      else if (activeFilter !== "全部") filterOk = (p.tags || []).includes(activeFilter);

      const kwOk =
        !kw ||
        `${p.name} ${p.nameCn} ${p.description} ${(p.tags || []).join(",")}`
          .toLowerCase()
          .includes(kw);

      return filterOk && kwOk;
    });
  }, [activeFilter, keyword]);

  return (
    <main className="max-w-3xl mx-auto pb-10">
      <div className="sticky top-0 bg-[var(--bg)] z-10 px-4 pt-4 pb-2 border-b border-[var(--line)]">
        <h1 className="text-xl font-semibold m-0 mb-3">🇸🇬 新加坡本地游指南</h1>

        <div className="mb-3">
          <WeatherBar />
        </div>

        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索地点、关键词..."
          className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--line)] text-sm mb-3"
        />

        <div className="flex items-center justify-between gap-3">
          <TagFilter options={filterOptions} active={activeFilter} onChange={setActiveFilter} />
        </div>
        <div className="mt-3">
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      <div className="px-4 pt-4">
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-16 text-sm">没有找到匹配的地点</p>
        )}

        {view === "list" && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((p) => (
              <PlaceCard
                key={p.id}
                place={p}
                onOpen={(place) => setModal({ place, tab: "info" })}
                onOpenMenu={(place) => setModal({ place, tab: "menu" })}
              />
            ))}
          </div>
        )}

        {view === "map" && (
          <MapView places={filtered} onOpen={(place) => setModal({ place, tab: "info" })} />
        )}
      </div>

      {modal && (
        <PlaceModal
          place={modal.place}
          initialTab={modal.tab}
          onClose={() => setModal(null)}
        />
      )}
    </main>
  );
}
