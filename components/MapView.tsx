// components/MapView.tsx
"use client";

import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Popup,
  LayersControl,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import * as Papa from "papaparse";


type AnyGeoJSON = GeoJSON.FeatureCollection | GeoJSON.Feature | any;

type PointRow = {
  lat?: string | number;
  lon?: string | number;
  latitude?: string | number;
  longitude?: string | number;
  type?: string;
  name?: string;
};

function toNum(v: unknown) {
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? (n as number) : undefined;
}

export default function MapView({
  districtsGeoJsonUrl,
  pointsCsvUrl,
}: {
  districtsGeoJsonUrl: string;
  pointsCsvUrl?: string;
}) {
  const [districts, setDistricts] = useState<AnyGeoJSON | null>(null);
  const [points, setPoints] = useState<PointRow[]>([]);

  useEffect(() => {
    fetch(districtsGeoJsonUrl)
      .then((r) => r.json())
      .then(setDistricts)
      .catch(() => setDistricts(null));
  }, [districtsGeoJsonUrl]);

  useEffect(() => {
    if (!pointsCsvUrl) return;
    Papa.parse<PointRow>(pointsCsvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (res) => setPoints(res.data ?? []),
    });
  }, [pointsCsvUrl]);

  const center = useMemo<LatLngExpression>(() => [43.238949, 76.889709], []); // Алматы

  const styleDistrict = () => ({
    color: "#64748b",
    weight: 1,
    fillColor: "#94a3b8",
    fillOpacity: 0.15,
  });

  const typeColor = (t: string) => {
    const k = t.toLowerCase();
    if (k.includes("воркаут")) return "#0ea5e9";
    if (k.includes("футбол")) return "#22c55e";
    if (k.includes("баскет")) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <MapContainer center={center} zoom={11} scrollWheelZoom className="w-full h-full">
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LayersControl position="topright">
          {districts && (
            <LayersControl.Overlay checked name="Районы">
              <GeoJSON data={districts as any} style={styleDistrict} />
            </LayersControl.Overlay>
          )}

          {points.length > 0 && (
            <LayersControl.Overlay checked name="Объекты / рекомендации">
              <>
                {points.map((p, i) => {
                  const lat = toNum(p.lat ?? p.latitude);
                  const lon = toNum(p.lon ?? p.longitude);
                  if (lat === undefined || lon === undefined) return null;
                  const t = p.type || "объект";
                  return (
                    <CircleMarker
                      key={i}
                      center={[lat, lon]}
                      radius={5}
                      pathOptions={{ color: typeColor(t), fillOpacity: 0.9 }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <div className="font-semibold mb-1">{p.name || "Объект"}</div>
                          <div>Тип: {t}</div>
                          <div>
                            Коорд.: {lat.toFixed(5)}, {lon.toFixed(5)}
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </>
            </LayersControl.Overlay>
          )}
        </LayersControl>
      </MapContainer>
    </div>
  );
}
