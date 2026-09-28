"use client";

import { List, Map } from "lucide-react";
import { t } from "../lib/i18n";

export default function ViewToggle({ view, onChange, lang }) {
  return (
    <div className="inline-flex bg-white border border-[var(--line)] rounded-full p-1">
      <button
        className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-full ${
          view === "list" ? "bg-accent text-white" : "text-gray-500"
        }`}
        onClick={() => onChange("list")}
      >
        <List size={14} /> {t(lang, "viewList")}
      </button>
      <button
        className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-full ${
          view === "map" ? "bg-accent text-white" : "text-gray-500"
        }`}
        onClick={() => onChange("map")}
      >
        <Map size={14} /> {t(lang, "viewMap")}
      </button>
    </div>
  );
}
