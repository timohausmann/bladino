import { resolveAssetUrl } from '@/utils/resolveAssetUrl';

const AVATAR_BASE_PATH = import.meta.env.VITE_AVATAR_URL ?? '/avatare';

/** Shown when the account has no avatar file. */
export const AVATAR_FALLBACK_SRC = '/avatar_fallback.png';

/**
 * Resolves an avatar filename from the API to a browser URL.
 * Pass-through for already-resolved paths and external URLs.
 */
export function resolveAvatarUrl(avatar?: string | null): string | undefined {
  return resolveAssetUrl(avatar, AVATAR_BASE_PATH);
}
