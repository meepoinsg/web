"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function PlaceModal({ place, initialTab = "info", onClose }) {
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [place, initialTab]);

  if (!place) return null;

  const hasMenu = place.menuPhotos && place.menuPhotos.length > 0;
  const gallery = tab === "menu" ? place.menuPhotos : place.photos;

  return (
    <div
      className="fixed inset-0 bg-black/55 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[88vh] overflow-y-auto p-5 relative">
        <button
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          onClick={onClose}
        >
          <X size={16} />
        </button>

        <h2 className="text-xl font-semibold pr-8 m-0">{place.nameCn || place.name}</h2>
        <p className="text-sm text-gray-500 m-0">{place.name}</p>
        <div className="text-xs text-gray-500 mt-2">
          {place.area}
          {place.rating ? ` · ⭐ ${place.rating}` : ""}
          {place.suggestedDuration ? ` · 建议停留 ${place.suggestedDuration}` : ""}
        </div>

        {hasMenu && (
          <div className="flex gap-2 mt-4">
            <button
              className={`text-sm px-3 py-1.5 rounded-full ${
                tab === "info" ? "bg-accent text-white" : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setTab("info")}
            >
              详情图片
            </button>
            <button
              className={`text-sm px-3 py-1.5 rounded-full ${
                tab === "menu" ? "bg-accent text-white" : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setTab("menu")}
            >
              菜单/图片
            </button>
          </div>
        )}

        {gallery && gallery.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mt-4">
            {gallery.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="h-32 rounded-lg flex-shrink-0"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ))}
          </div>
        )}

        {tab === "info" && (
          <>
            <div className="mt-4">
              <h4 className="text-xs text-gray-500 font-semibold m-0 mb-1">介绍</h4>
              <p className="text-sm leading-relaxed m-0">{place.description}</p>
            </div>
            <div className="mt-4">
              <h4 className="text-xs text-gray-500 font-semibold m-0 mb-1">地址</h4>
              <p className="text-sm leading-relaxed m-0">{place.address}</p>
            </div>
            {place.openingHours && (
              <div className="mt-4">
                <h4 className="text-xs text-gray-500 font-semibold m-0 mb-1">营业时间</h4>
                <p className="text-sm leading-relaxed m-0">{place.openingHours}</p>
              </div>
            )}
            <div className="flex gap-2 mt-5">
              {place.mapLink && (
                <a
                  href={place.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-sm bg-accent text-white rounded-lg py-2.5"
                >
                  在地图中打开
                </a>
              )}
              {place.bookingUrl && (
                <a
                  href={place.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-sm border border-[var(--line)] rounded-lg py-2.5"
                >
                  立即预订
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
