"use client";

import dynamic from "next/dynamic";

interface MiningMapProps {
  latitude: number;
  longitude: number;
  label?: string;
}

const MiningMapInner = dynamic(() => import("./MiningMapInner"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 360,
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

export default function MiningMap({ latitude, longitude, label }: MiningMapProps) {
  return <MiningMapInner latitude={latitude} longitude={longitude} label={label} />;
}
