"use client";

import { getCategory, categoryLabel } from "../lib/categories";
import { TAGS, localize } from "../lib/vocab";
import { t, localizeField } from "../lib/i18n";
import { cutlerySvg } from "../lib/binIcon";

const BIN_BADGE_STYLE = {
  bin1: "bg-accent text-white",
  bin2: "bg-orange-100 text-accent",
  bin3: "bg-gray-100 text-gray-500",
};
const BIN_BADGE_LABEL = { bin1: "Bin1", bin2: "Bin2", bin3: "Bin3" };

function priceLine(place, lang) {
  const f = place.restaurantFeatures;
  if (!f) return null;
  const prefix = lang === "en" ? "Avg." : "人均";
  if (f.avgSpendSGD) return `${prefix} S$${f.avgSpendSGD}`;
  if (f.avgSpendMinSGD && f.avgSpendMaxSGD) {
    return `${prefix} S$${f.avgSpendMinSGD}-${f.avgSpendMaxSGD}`;
  }
  return null;
}

export default function PlaceCard({ place, onOpen, lang = "zh" }) {
  const cat = getCategory(place.type);
  const cover = place.photos && place.photos[0];
  const price = priceLine(place, lang);
  const description = localizeField(place, "description", lang);
  const duration = localizeField(place, "suggestedDuration", lang);

  const primaryName = lang === "en" ? place.name : place.nameCn || place.name;
  const secondaryName = lang === "en" ? place.nameCn : place.name;
  const recommendBin = place.restaurantFeatures && place.restaurantFeatures.recommendBin;

  return (
    <div className="bg-white rounded-2xl border border-[var(--line)] overflow-hidden">
      <div
        className="h-40 bg-gradient-to-br from-[#f0e9df] to-[#e4ddd0] flex items-center justify-center text-2xl cursor-pointer overflow-hidden relative"
        onClick={() => onOpen(place)}
      >
        {recommendBin && BIN_BADGE_LABEL[recommendBin] ? (
          <span
            className={`absolute top-2 left-2 z-[1] flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${BIN_BADGE_STYLE[recommendBin]}`}
          >
            {BIN_BADGE_LABEL[recommendBin]}
            <span
              className="inline-flex"
              dangerouslySetInnerHTML={{ __html: cutlerySvg(recommendBin, place.id, 12) }}
            />
          </span>
        ) : null}
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={place.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement.innerText = cat.icon;
            }}
          />
        ) : (
          cat.icon
        )}
      </div>

      <div className="p-4 cursor-pointer" onClick={() => onOpen(place)}>
        <h3 className="font-semibold text-base m-0">{primaryName}</h3>
        {secondaryName && <p className="text-xs text-gray-500 m-0 mt-0.5">{secondaryName}</p>}
        <div className="text-xs text-gray-500 mt-1.5">
          {categoryLabel(place.type, lang)} · {place.area}
          {place.rating ? ` · ⭐ ${place.rating}` : ""}
          {price ? ` · ${price}` : ""}
          {duration ? ` · ${duration}` : ""}
        </div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
        <div className="flex gap-1.5 flex-wrap mt-2">
          {(place.tags || []).map((tagKey) => (
            <span
              key={tagKey}
              className="text-[11px] bg-orange-50 text-accent px-2 py-0.5 rounded-full"
            >
              {localize(TAGS, tagKey, lang)}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-4 pb-4">
        {place.mapLink ? (
          <a
            href={place.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm bg-accent text-white rounded-lg py-2"
            onClick={(e) => e.stopPropagation()}
          >
            {t(lang, "cardMap")}
          </a>
        ) : null}
        {place.bookingUrl ? (
          <a
            href={place.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm border border-[var(--line)] rounded-lg py-2"
            onClick={(e) => e.stopPropagation()}
          >
            {t(lang, "cardBooking")}
          </a>
        ) : null}
      </div>
    </div>
  );
}
