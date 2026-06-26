import { AsyncImage } from '@/components/ui/AsyncImage';
import { ExternalLink } from 'lucide-react';
import { useMemo } from 'react';

interface LinkPreviewProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  icon?: string;
}

/**
 * LinkPreview - Displays a weblink card using metadata from the API.
 * On tablets and larger screens (sm breakpoint), displays image and content in a single row.
 */
export function LinkPreview({
  url,
  title,
  description,
  image,
  icon,
}: LinkPreviewProps) {
  const domain = useMemo(() => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  }, [url]);

  const displayTitle = title || domain;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-inherit no-underline"
      aria-label={`Visit ${displayTitle}`}
      tabIndex={0}
    >
      <div className="flex flex-col overflow-hidden rounded-lg bg-black/5 transition-all duration-200 hover:bg-black/10 sm:flex-row dark:bg-black/20 dark:hover:bg-black/30">
        {image && (
          <AsyncImage
            src={image}
            alt={displayTitle}
            className="h-40 w-full flex-shrink-0 bg-black/10 sm:w-1/3 sm:max-w-[240px]"
          />
        )}

        <div className="flex-grow p-3 sm:p-4">
          <div className="text-muted-foreground mb-2 flex items-center text-sm">
            {icon && (
              <img
                src={icon}
                alt=""
                aria-hidden
                className="mr-1.5 h-4 w-4 flex-shrink-0 rounded-sm object-contain"
              />
            )}
            <span>{domain}</span>
            <ExternalLink size={14} className="ml-1.5" />
          </div>

          <h3 className="text-foreground m-0 mb-2 text-base leading-tight font-semibold">
            {displayTitle}
          </h3>

          {description && (
            <p className="text-muted-foreground m-0 line-clamp-2 text-sm leading-normal">
              {description}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
