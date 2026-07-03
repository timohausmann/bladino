/** Splits comma- or semicolon-separated address fields into trimmed entries. */
export function parseAddresses(value: string): string[] {
  return value
    .split(/[,;]/)
    .map((address) => address.trim())
    .filter(Boolean);
}
