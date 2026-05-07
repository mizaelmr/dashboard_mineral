export function formatPhone(value: string | null | undefined): string {
  if (value == null || typeof value !== "string") {
    return "";
  }
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) {
    return "";
  }
  if (digits.length >= 11) {
    const ddd = digits.slice(0, 2);
    const nine = digits.slice(2, 3);
    const first = digits.slice(3, 7);
    const last = digits.slice(7, 11);
    return `(${ddd}) ${nine} ${first}-${last}`;
  }
  if (digits.length >= 10) {
    const ddd = digits.slice(0, 2);
    const first = digits.slice(2, 6);
    const last = digits.slice(6, 10);
    return `(${ddd}) ${first}-${last}`;
  }
  if (digits.length >= 6) {
    const ddd = digits.slice(0, 2);
    const rest = digits.slice(2);
    return `(${ddd}) ${rest}`;
  }
  if (digits.length >= 2) {
    return `(${digits})`;
  }
  return digits;
}
