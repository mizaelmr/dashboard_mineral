export function capitalizeWords(value: string | null | undefined): string {
  if (value == null || typeof value !== "string") {
    return "";
  }
  const trimmed = value.trim();
  if (trimmed === "") {
    return "";
  }
  return trimmed
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}
