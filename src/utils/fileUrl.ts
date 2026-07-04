import { resolveAssetUrl } from '@/utils/resolveAssetUrl';

const FILE_BASE_PATH = import.meta.env.VITE_UPLOAD_URL ?? '/upload';

/**
 * Resolves a file filename from the API to a browser URL.
 * Pass-through for already-resolved paths and external URLs.
 */
export function resolveFileUrl(filename?: string | null): string | undefined {
  return resolveAssetUrl(filename, FILE_BASE_PATH);
}
