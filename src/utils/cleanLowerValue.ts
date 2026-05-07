export function cleanLowerValue(value: string | undefined): string | undefined {
  if (!value || value.trim() === "" || value === "$undefined") {
    return undefined;
  }
  return value.trim().toLowerCase();
}
