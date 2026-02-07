export function stripDocument(value: string | null | undefined): string {
  if (value == null) return "";
  return String(value).replace(/\D/g, "");
}

export function formatCpf(value: string | null | undefined): string {
  const digits = stripDocument(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatCnpj(value: string | null | undefined): string {
  const digits = stripDocument(value).slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export function formatDocument(
  raw: string | null | undefined,
  documentType: "CPF" | "CNPJ"
): string {
  if (raw == null || raw === "") return "";
  const digits = stripDocument(raw);
  return documentType === "CPF" ? formatCpf(digits) : formatCnpj(digits);
}
