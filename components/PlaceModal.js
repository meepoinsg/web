"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { getCategory } from "../lib/categories";

function FeatureRow({ label, children }) {
  if (children === null || children === undefined || children === "") return null;
  if (Array.isArray(children) && children.length === 0) return null;
  return (
    <div className="flex gap-2 py-1.5 border-b border-gray-100 last:border-b-0 text-sm">
      <div className="w-20 flex-shrink-0 text-gray-400">{label}</div>
      <div className="flex-1 text-gray-700">{children}</div>
    </div>
  );
}

function joinOrNull(arr) {
  return Array.isArray(arr) && arr.length > 0 ? arr.join("、") : null;
}

const WEATHER_LABEL = {
  indoor: "室内",
  outdoor: "户外",
  mixed: "室内外皆宜",
};

function RestaurantFeatures({ f }) {
  if (!f) return null;
  const price =
    f.avgSpendSGD != null
      ? `S$${f.avgSpendSGD} / 人`
      : f.avgSpendMinSGD != null && f.avgSpendMaxSGD != null
      ? `S$${f.avgSpendMinSGD}-${f.avgSpendMaxSGD} / 人`
      : null;

  const dietaryBits = [
    f.dietaryIsHalal ? "清真认证" : null,
    f.dietaryHasVegetarian ? "提供素食" : null,
    f.dietaryPorkFree ? "不含猪肉" : null,
  ].filter(Boolean);

  return (
    <div className="mt-1">
      <FeatureRow label="价格档位">{f.priceLevel}</FeatureRow>
      <FeatureRow label="人均消费">{price}</FeatureRow>
      <FeatureRow label="菜系">{joinOrNull(f.cuisine)}</FeatureRow>
      <FeatureRow label="招牌菜">
        {Array.isArray(f.signatureDishes) && f.signatureDishes.length > 0 ? (
          <ul className="list-disc pl-4 space-y-0.5">
            {f.signatureDishes.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        ) : null}
      </FeatureRow>
      <FeatureRow label="氛围">{joinOrNull(f.atmosphere)}</FeatureRow>
      <FeatureRow label="座位">{joinOrNull(f.seatingOptions)}</FeatureRow>
      <FeatureRow label="着装">{f.dressCode || null}</FeatureRow>
      <FeatureRow label="饮食">{dietaryBits.length > 0 ? dietaryBits.join(" · ") : null}</FeatureRow>
      <FeatureRow label="预订">
        {f.reservationRequired
          ? [f.reservationDifficulty, f.reservationPlatform].filter(Boolean).join(" · ") ||
            "建议提前预订"
          : "无需预订"}
      </FeatureRow>
    </div>
  );
}

function AttractionFeatures({ f }) {
  if (!f) return null;
  const ticket = f.ticketIsFree
    ? "免费"
    : [f.ticketPriceDesc, f.ticketBookingRequired ? "建议提前订票" : null]
        .filter(Boolean)
        .join(" · ");

  return (
    <div className="mt-1">
      <FeatureRow label="分类">{f.subCategory}</FeatureRow>
      <FeatureRow label="最佳时间">{f.bestTimeVisit}</FeatureRow>
      <FeatureRow label="天气">{WEATHER_LABEL[f.weatherAdaptability] || null}</FeatureRow>
      <FeatureRow label="门票">{ticket || null}</FeatureRow>
      <FeatureRow label="必看亮点">
        {Array.isArray(f.highlights) && f.highlights.length > 0 ? (
          <ul className="list-disc pl-4 space-y-0.5">
            {f.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        ) : null}
      </FeatureRow>
      <FeatureRow label="适合人群">{joinOrNull(f.suitableFor)}</FeatureRow>
      <FeatureRow label="设施">{joinOrNull(f.facilities)}</FeatureRow>
    </div>
  );
}

function Gallery({ photos, onClose }) {
  const scrollerRef = useRef(null);
  const [index, setIndex] = useState(0);
  const hasPhotos = Array.isArray(photos) && photos.length > 0;

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div className="relative -mx-5 -mt-5 rounded-t-2xl overflow-hidden bg-gray-100">
      <button
        className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center z-10"
        onClick={onClose}
      >
        <X size={16} />
      </button>

      {hasPhotos ? (
        <>
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {photos.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src + i}
                src={src}
                alt=""
                className="w-full flex-shrink-0 snap-center object-cover"
                style={{ height: 260, scrollSnapAlign: "center" }}
                onError={(e) => (e.currentTarget.style.opacity = 0)}
              />
            ))}
          </div>
          {photos.length > 1 && (
            <div className="absolute bottom-2 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
              {index + 1}/{photos.length}
            </div>
          )}
        </>
      ) : (
        <div className="h-40 flex items-center justify-center text-3xl">📍</div>
      )}
    </div>
  );
}

export default function PlaceModal({ place, onClose }) {
  if (!place) return null;
  const cat = getCategory(place.type);

  return (
    <div
      className="fixed inset-0 bg-black/55 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[88vh] overflow-y-auto p-5 relative">
        <Gallery photos={place.photos} onClose={onClose} />

        <div className="pt-4">
          <h2 className="text-xl font-semibold m-0">{place.nameCn || place.name}</h2>
          <p className="text-sm text-gray-500 m-0">{place.name}</p>
          <div className="text-xs text-gray-500 mt-2">
            {cat.label} · {place.area}
            {place.rating ? ` · ⭐ ${place.rating}` : ""}
            {place.suggestedDuration ? ` · ${place.suggestedDuration}` : ""}
          </div>

          {place.type === "restaurant" && <RestaurantFeatures f={place.restaurantFeatures} />}
          {place.type === "attraction" && <AttractionFeatures f={place.attractionFeatures} />}

          {place.recommendNote && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <p className="text-sm leading-relaxed m-0 text-amber-800">
                💡 {place.recommendNote}
              </p>
            </div>
          )}

          {place.description && (
            <div className="mt-4">
              <h4 className="text-xs text-gray-500 font-semibold m-0 mb-1">介绍</h4>
              <p className="text-sm leading-relaxed m-0">{place.description}</p>
            </div>
          )}

          {place.address && (
            <div className="mt-3">
              <h4 className="text-xs text-gray-500 font-semibold m-0 mb-1">地址</h4>
              <p className="text-sm leading-relaxed m-0">{place.address}</p>
            </div>
          )}

          {place.openingHours && (
            <div className="mt-3">
              <h4 className="text-xs text-gray-500 font-semibold m-0 mb-1">时间</h4>
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
            {place.guideUrl && (
              <a
                href={place.guideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-sm border border-[var(--line)] rounded-lg py-2.5"
              >
                查看攻略
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
