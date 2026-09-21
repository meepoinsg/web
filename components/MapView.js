"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCategory } from "../lib/categories";

const SINGAPORE_CENTER = [1.3521, 103.8198];

function makeIcon(type) {
  const cat = getCategory(type);
  return L.divIcon({
    html: `<div style="background:${cat.color};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.35);">${cat.icon}</div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

export default function MapView({ places, onOpen }) {
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
            const cat = getCategory(p.type);
            return (
              <Marker key={p.id} position={p.coordinates} icon={makeIcon(p.type)}>
                <Popup>
                  <div style={{ width: 160 }}>
                    <strong>{p.nameCn || p.name}</strong>
                    <div style={{ fontSize: 12, color: "#6b7280", margin: "4px 0" }}>
                      {cat.label} · {p.area}
                      {p.rating ? ` · ⭐${p.rating}` : ""}
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
                      查看详情 →
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
