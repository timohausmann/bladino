const AVATAR_BASE_PATH = '/avatare';

/**
 * Resolves an avatar filename from the API to a browser URL.
 * Pass-through for already-resolved paths and external URLs.
 */
export function resolveAvatarUrl(avatar?: string | null): string | undefined {
  if (!avatar) {
    return undefined;
  }

  if (
    avatar.startsWith('/') ||
    avatar.startsWith('http://') ||
    avatar.startsWith('https://')
  ) {
    return avatar;
  }

  return `${AVATAR_BASE_PATH}/${avatar}`;
}
