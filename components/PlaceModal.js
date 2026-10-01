"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { categoryLabel } from "../lib/categories";
import { CUISINE, ATMOSPHERE, SEATING_OPTIONS, SUITABLE_FOR, FACILITIES, SUB_CATEGORY, WEATHER_ADAPT, VEGETARIAN_LEVEL, localize, localizeList } from "../lib/vocab";
import { t, localizeField } from "../lib/i18n";

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

function RestaurantFeatures({ f, lang }) {
  if (!f) return null;
  const price =
    f.avgSpendSGD != null
      ? `S$${f.avgSpendSGD} ${t(lang, "perPerson")}`
      : f.avgSpendMinSGD != null && f.avgSpendMaxSGD != null
      ? `S$${f.avgSpendMinSGD}-${f.avgSpendMaxSGD} ${t(lang, "perPerson")}`
      : null;

  const dietaryBits = [
    f.dietaryIsHalal ? t(lang, "dietaryHalal") : null,
    f.vegetarianLevel ? localize(VEGETARIAN_LEVEL, f.vegetarianLevel, lang) : null,
    f.dietaryPorkFree ? t(lang, "dietaryPorkFree") : null,
  ].filter(Boolean);

  const signatureDishes = localizeField(f, "signatureDishes", lang);
  const reservationDifficulty = localizeField(f, "reservationDifficulty", lang);
  const reservationPlatform = localizeField(f, "reservationPlatform", lang);

  return (
    <div className="mt-1">
      <FeatureRow label={t(lang, "featurePriceLevel")}>{f.priceLevel}</FeatureRow>
      <FeatureRow label={t(lang, "featureAvgSpend")}>{price}</FeatureRow>
      <FeatureRow label={t(lang, "featureCuisine")}>{joinOrNull(localizeList(CUISINE, f.cuisine, lang))}</FeatureRow>
      <FeatureRow label={t(lang, "featureSignatureDishes")}>
        {Array.isArray(signatureDishes) && signatureDishes.length > 0 ? (
          <ul className="list-disc pl-4 space-y-0.5">
            {signatureDishes.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        ) : null}
      </FeatureRow>
      <FeatureRow label={t(lang, "featureAtmosphere")}>{joinOrNull(localizeList(ATMOSPHERE, f.atmosphere, lang))}</FeatureRow>
      <FeatureRow label={t(lang, "featureSeating")}>{joinOrNull(localizeList(SEATING_OPTIONS, f.seatingOptions, lang))}</FeatureRow>
      <FeatureRow label={t(lang, "featureDressCode")}>{localizeField(f, "dressCode", lang) || null}</FeatureRow>
      <FeatureRow label={t(lang, "featureDietary")}>{dietaryBits.length > 0 ? dietaryBits.join(" · ") : null}</FeatureRow>
      <FeatureRow label={t(lang, "featureReservation")}>
        {f.reservationRequired
          ? [reservationDifficulty, reservationPlatform].filter(Boolean).join(" · ") || t(lang, "reservationDefault")
          : t(lang, "reservationNotRequired")}
      </FeatureRow>
    </div>
  );
}

function AttractionFeatures({ f, lang }) {
  if (!f) return null;
  const ticketPriceDesc = localizeField(f, "ticketPriceDesc", lang);
  const highlights = localizeField(f, "highlights", lang);
  const ticket = f.ticketIsFree
    ? t(lang, "ticketFree")
    : [ticketPriceDesc, f.ticketBookingRequired ? t(lang, "ticketBookAhead") : null].filter(Boolean).join(" · ");

  return (
    <div className="mt-1">
      <FeatureRow label={t(lang, "featureSubCategory")}>{localize(SUB_CATEGORY, f.subCategory, lang)}</FeatureRow>
      <FeatureRow label={t(lang, "featureBestTime")}>{localizeField(f, "bestTimeVisit", lang)}</FeatureRow>
      <FeatureRow label={t(lang, "featureWeather")}>{localize(WEATHER_ADAPT, f.weatherAdaptability, lang)}</FeatureRow>
      <FeatureRow label={t(lang, "featureTicket")}>{ticket || null}</FeatureRow>
      <FeatureRow label={t(lang, "featureHighlights")}>
        {Array.isArray(highlights) && highlights.length > 0 ? (
          <ul className="list-disc pl-4 space-y-0.5">
            {highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        ) : null}
      </FeatureRow>
      <FeatureRow label={t(lang, "featureSuitableFor")}>{joinOrNull(localizeList(SUITABLE_FOR, f.suitableFor, lang))}</FeatureRow>
      <FeatureRow label={t(lang, "featureFacilities")}>{joinOrNull(localizeList(FACILITIES, f.facilities, lang))}</FeatureRow>
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

export default function PlaceModal({ place, onClose, lang = "zh" }) {
  if (!place) return null;

  const primaryName = lang === "en" ? place.name : place.nameCn || place.name;
  const secondaryName = lang === "en" ? place.nameCn : place.name;
  const duration = localizeField(place, "suggestedDuration", lang);
  const description = localizeField(place, "description", lang);
  const openingHours = localizeField(place, "openingHours", lang);
  const recommendNote = localizeField(place, "recommendNote", lang);

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
          <h2 className="text-xl font-semibold m-0">{primaryName}</h2>
          {secondaryName && <p className="text-sm text-gray-500 m-0">{secondaryName}</p>}
          <div className="text-xs text-gray-500 mt-2">
            {categoryLabel(place.type, lang)} · {place.area}
            {place.rating ? ` · ⭐ ${place.rating}` : ""}
            {duration ? ` · ${duration}` : ""}
          </div>

          {place.type === "restaurant" && <RestaurantFeatures f={place.restaurantFeatures} lang={lang} />}
          {place.type === "attraction" && <AttractionFeatures f={place.attractionFeatures} lang={lang} />}

          {recommendNote && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <p className="text-sm leading-relaxed m-0 text-amber-800">💡 {recommendNote}</p>
            </div>
          )}

          {description && (
            <div className="mt-4">
              <h4 className="text-xs text-gray-500 font-semibold m-0 mb-1">{t(lang, "modalIntro")}</h4>
              <p className="text-sm leading-relaxed m-0">{description}</p>
            </div>
          )}

          {place.address && (
            <div className="mt-3">
              <h4 className="text-xs text-gray-500 font-semibold m-0 mb-1">{t(lang, "modalAddress")}</h4>
              <p className="text-sm leading-relaxed m-0">{place.address}</p>
            </div>
          )}

          {openingHours && (
            <div className="mt-3">
              <h4 className="text-xs text-gray-500 font-semibold m-0 mb-1">{t(lang, "modalHours")}</h4>
              <p className="text-sm leading-relaxed m-0">{openingHours}</p>
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
                {t(lang, "modalOpenMap")}
              </a>
            )}
            {place.bookingUrl && (
              <a
                href={place.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-sm border border-[var(--line)] rounded-lg py-2.5"
              >
                {t(lang, "modalBooking")}
              </a>
            )}
            {place.guideUrl && (
              <a
                href={place.guideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-sm border border-[var(--line)] rounded-lg py-2.5"
              >
                {t(lang, "modalGuide")}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
