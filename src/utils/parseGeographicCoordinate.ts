function normalizeAngleText(raw: string): string {
  return raw.replace(/\u2212/g, "-").trim();
}

function parseSecondsPart(rest: string): number {
  const withoutQuoteSymbol = rest.replace(/\u2033|"/g, "").trim();
  const twinPrimeMatch = /^(\d+)''(\d+)''?$/.exec(withoutQuoteSymbol);
  if (twinPrimeMatch) {
    const intPart = parseInt(twinPrimeMatch[1], 10);
    const fracStr = twinPrimeMatch[2];
    const denom = Math.pow(10, fracStr.length);
    return intPart + parseInt(fracStr, 10) / denom;
  }
  const normalized = withoutQuoteSymbol.replace(/,/g, ".").replace(/''/g, "");
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : NaN;
}

function parseDegreesFromDmsOrDecimal(raw: string): number | null {
  const s = normalizeAngleText(raw);
  if (!s) return null;

  const main = /^(-?\d+)\s*[°º]?\s*(\d+)\s*['′]\s*(.+)$/iu.exec(s);
  if (main) {
    const degRaw = parseInt(main[1], 10);
    const sign = degRaw < 0 ? -1 : 1;
    const degAbs = Math.abs(degRaw);
    const minutes = parseInt(main[2], 10);
    const seconds = parseSecondsPart(main[3]);
    if (
      !Number.isFinite(minutes) ||
      !Number.isFinite(seconds) ||
      minutes < 0 ||
      seconds < 0
    ) {
      return null;
    }
    const value = sign * (degAbs + minutes / 60 + seconds / 3600);
    return Number.isFinite(value) ? value : null;
  }

  const decimal = parseFloat(s.replace(/,/g, "."));
  return Number.isFinite(decimal) ? decimal : null;
}

export function parseLatitudeValue(
  raw: string | number | null | undefined,
): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "number") {
    return Number.isFinite(raw) && raw >= -90 && raw <= 90 ? raw : null;
  }
  const s = String(raw).trim();
  if (!s) return null;
  const value = parseDegreesFromDmsOrDecimal(s);
  if (value === null) return null;
  if (value < -90 || value > 90) return null;
  return value;
}

export function parseLongitudeValue(
  raw: string | number | null | undefined,
): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "number") {
    return Number.isFinite(raw) && raw >= -180 && raw <= 180 ? raw : null;
  }
  const s = String(raw).trim();
  if (!s) return null;
  const value = parseDegreesFromDmsOrDecimal(s);
  if (value === null) return null;
  if (value < -180 || value > 180) return null;
  return value;
}

export function formatStoredCoordinate(
  value: number | string | null | undefined,
): string {
  if (value === null || value === undefined || value === "") return "";
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "";
  return String(n);
}
