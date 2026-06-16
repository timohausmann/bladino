import { resolveAvatarUrl } from "@/utils/avatarUrl";

interface AvatarProps {
  /** Resolved image URL – use for external/mock URLs */
  src?: string;
  /** Avatar filename from API – resolved via /avatare/ */
  avatar?: string | null;
  alt: string;
  className?: string;
}

/**
 * Avatar component - displays a circular avatar image.
 * Prefer `avatar` for API filenames; `src` for pre-resolved URLs.
 */
export function Avatar({ src, avatar, alt, className = "" }: AvatarProps) {
  const resolvedSrc = src ?? resolveAvatarUrl(avatar);

  if (!resolvedSrc) {
    return (
      <div
        className={`rounded-full overflow-hidden aspect-square bg-muted ${className}`}
        aria-label={alt}
      />
    );
  }

  return (
    <div className={`rounded-full overflow-hidden aspect-square ${className}`}>
      <img src={resolvedSrc} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
