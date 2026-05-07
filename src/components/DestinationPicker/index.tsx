"use client";

import React, { useState } from "react";
import { Button, Input, List, Spin, Typography } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { searchLocation } from "@/utils/nominatim";
import { parseLatitudeValue, parseLongitudeValue } from "@/utils/parseGeographicCoordinate";

export interface DestinationValue {
  city: string;
  state: string;
  lat: number;
  lng: number;
  display: string; // "Cidade, UF"
}

interface Props {
  value?: DestinationValue | null;
  onChange?: (val: DestinationValue | null) => void;
}

function extractCityState(displayName: string): { city: string; state: string } {
  // Nominatim retorna algo como: "São Paulo, Região Imediata de São Paulo, ..., São Paulo, Sudeste, Brasil"
  const parts = displayName.split(",").map((s) => s.trim());
  const city = parts[0] ?? "";
  // Tentar encontrar o estado (geralmente o penúltimo antes de "Brasil")
  const brasilIdx = parts.findIndex((p) => p.toLowerCase() === "brasil");
  const state = brasilIdx > 1 ? parts[brasilIdx - 1] : parts[1] ?? "";
  // Pegar sigla se tiver entre parênteses ou usar as primeiras 2 letras do estado como fallback
  const siglaMatch = state.match(/\(([A-Z]{2})\)/);
  const stateUF = siglaMatch ? siglaMatch[1] : state.substring(0, 2).toUpperCase();
  return { city, state: stateUF };
}

export default function DestinationPicker({ value, onChange }: Props) {
  const [query, setQuery] = useState(value?.display ?? "");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Awaited<ReturnType<typeof searchLocation>>>([]);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setResults([]);
    setNotFound(false);
    try {
      const res = await searchLocation(q);
      if (res.length === 0) setNotFound(true);
      else setResults(res);
    } catch {
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = (item: (typeof results)[0]) => {
    const lat = parseLatitudeValue(item.lat);
    const lng = parseLongitudeValue(item.lon);
    if (lat === null || lng === null) return;
    const { city, state } = extractCityState(item.display_name);
    const dest: DestinationValue = {
      city,
      state,
      lat,
      lng,
      display: `${city}, ${state}`,
    };
    setQuery(dest.display);
    setResults([]);
    setNotFound(false);
    onChange?.(dest);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setNotFound(false);
    onChange?.(null);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onPressEnter={handleSearch}
          placeholder="Digite cidade ou endereço de destino"
          style={{ flex: 1 }}
          suffix={
            value ? (
              <EnvironmentOutlined style={{ color: "#1677ff" }} />
            ) : undefined
          }
        />
        <Button icon={<SearchOutlined />} onClick={handleSearch} loading={searching}>
          Buscar
        </Button>
        {value && (
          <Button onClick={handleClear} danger>
            Limpar
          </Button>
        )}
      </div>

      {searching && (
        <div style={{ padding: "4px 0" }}>
          <Spin size="small" />
          <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
            Buscando...
          </Typography.Text>
        </div>
      )}

      {notFound && (
        <Typography.Text type="warning">
          Nenhum resultado encontrado para &quot;{query}&quot;.
        </Typography.Text>
      )}

      {results.length > 0 && (
        <List
          size="small"
          bordered
          style={{ maxHeight: 200, overflowY: "auto", marginTop: 4 }}
          dataSource={results}
          renderItem={(item) => (
            <List.Item style={{ cursor: "pointer" }} onClick={() => handleSelect(item)}>
              <EnvironmentOutlined style={{ marginRight: 8, color: "#1677ff" }} />
              {item.display_name}
            </List.Item>
          )}
        />
      )}

      {value && (
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          📍 {value.display} ({value.lat.toFixed(5)}, {value.lng.toFixed(5)})
        </Typography.Text>
      )}
    </div>
  );
}
