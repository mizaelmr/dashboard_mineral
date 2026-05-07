"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RouteMapProps } from "./index";

const originIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const destIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds({ origin, destination }: RouteMapProps) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(
      [origin.lat, origin.lng],
      [destination.lat, destination.lng],
    );
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [origin, destination, map]);
  return null;
}

export default function RouteMapInner({ origin, destination }: RouteMapProps) {
  const center: [number, number] = [
    (origin.lat + destination.lat) / 2,
    (origin.lng + destination.lng) / 2,
  ];

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: 400, width: "100%", borderRadius: 8 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds origin={origin} destination={destination} />
      <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
        <Popup>
          <strong>Origem (Lavra)</strong><br />{origin.label}
        </Popup>
      </Marker>
      <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
        <Popup>
          <strong>Destino</strong><br />{destination.label}
        </Popup>
      </Marker>
      <Polyline
        positions={[[origin.lat, origin.lng], [destination.lat, destination.lng]]}
        pathOptions={{ color: "#1677ff", weight: 2, dashArray: "6 4", opacity: 0.7 }}
      />
    </MapContainer>
  );
}
