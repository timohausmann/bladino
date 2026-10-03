import { resolveAvatarUrl, AVATAR_FALLBACK_SRC } from '@/utils/avatarUrl';

interface AvatarProps {
  /** Resolved image URL – use for external/mock URLs */
  src?: string;
  /** Avatar filename from API – resolved via VITE_AVATAR_URL */
  avatar?: string | null;
  alt: string;
  className?: string;
}

/**
 * Avatar component - displays a circular avatar image.
 * Prefer `avatar` for API filenames; `src` for pre-resolved URLs.
 */
export function Avatar({ src, avatar, alt, className = '' }: AvatarProps) {
  const resolvedSrc = src || resolveAvatarUrl(avatar) || AVATAR_FALLBACK_SRC;

  return (
    <div className={`aspect-square overflow-hidden rounded-full ${className}`}>
      <img src={resolvedSrc} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}
