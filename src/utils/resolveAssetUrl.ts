/**
 * Resolves an asset filename from the API to a browser URL.
 * Pass-through for already-resolved paths, blob URLs, and external URLs.
 */
export function resolveAssetUrl(
  asset: string | null | undefined,
  configuredBase: string,
): string | undefined {
  if (!asset) {
    return undefined;
  }

  if (
    asset.startsWith('/') ||
    asset.startsWith('http://') ||
    asset.startsWith('https://') ||
    asset.startsWith('blob:')
  ) {
    return asset;
  }

  const base = configuredBase.replace(/\/$/, '');
  return `${base}/${asset}`;
}
