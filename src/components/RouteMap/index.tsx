"use client";

import dynamic from "next/dynamic";

export interface RouteMapProps {
  origin: { lat: number; lng: number; label: string };
  destination: { lat: number; lng: number; label: string };
}

const RouteMapInner = dynamic(() => import("./RouteMapInner"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
      }}
    >
      Carregando mapa...
    </div>
  ),
});

export default function RouteMap({ origin, destination }: RouteMapProps) {
  return <RouteMapInner origin={origin} destination={destination} />;
}
