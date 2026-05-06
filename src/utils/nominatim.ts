export interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export async function searchLocation(query: string): Promise<NominatimResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "5",
    countrycodes: "br",
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    { headers: { "Accept-Language": "pt-BR" } }
  );
  if (!res.ok) throw new Error("Falha ao buscar localização");
  return res.json() as Promise<NominatimResult[]>;
}
