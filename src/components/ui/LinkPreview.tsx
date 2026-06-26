import { AsyncImage } from '@/components/ui/AsyncImage';
import { ExternalLink } from 'lucide-react';
import { useMemo } from 'react';
import { tv } from 'tailwind-variants';

export type LinkPreviewVariant = 'default' | 'compact';

const linkPreview = tv({
  slots: {
    card: [
      'flex flex-col overflow-hidden rounded-lg bg-black/5',
      'transition-all duration-200 hover:bg-black/10',
      'sm:flex-row dark:bg-black/20 dark:hover:bg-black/30',
    ],
    image: 'h-40 w-full flex-shrink-0 bg-black/10 sm:w-1/3 sm:max-w-[240px]',
    content: 'flex-grow p-3 sm:p-4',
    domain: 'text-muted-foreground mb-2 flex items-center text-sm',
    favicon: 'mr-1.5 h-4 w-4 flex-shrink-0 rounded-sm object-contain',
    title: 'text-foreground m-0 mb-2 text-base leading-tight font-semibold',
    description:
      'text-muted-foreground m-0 line-clamp-2 text-sm leading-normal',
  },
  variants: {
    variant: {
      default: {},
      compact: {
        card: 'rounded-md',
        image: 'h-28 sm:max-w-[180px]',
        content: 'p-2 pl-3 sm:p-2.5 sm:pl-4',
        domain: 'mb-1 text-xs',
        favicon: 'mr-1 h-3.5 w-3.5',
        title: 'mb-1 text-sm',
        description: 'text-xs',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface LinkPreviewProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  icon?: string;
  variant?: LinkPreviewVariant;
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
  variant = 'default',
}: LinkPreviewProps) {
  const domain = useMemo(() => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  }, [url]);

  const displayTitle = title || domain;
  const styles = linkPreview({ variant });
  const externalLinkSize = variant === 'compact' ? 12 : 14;
  const externalLinkClass = variant === 'compact' ? 'ml-1' : 'ml-1.5';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-inherit no-underline"
      aria-label={`Visit ${displayTitle}`}
      tabIndex={0}
    >
      <div className={styles.card()}>
        {image && (
          <AsyncImage
            src={image}
            alt={displayTitle}
            className={styles.image()}
          />
        )}

        <div className={styles.content()}>
          <div className={styles.domain()}>
            {icon && (
              <img src={icon} alt="" aria-hidden className={styles.favicon()} />
            )}
            <span>{domain}</span>
            <ExternalLink
              size={externalLinkSize}
              className={externalLinkClass}
            />
          </div>

          <h3 className={styles.title()}>{displayTitle}</h3>

          {description && <p className={styles.description()}>{description}</p>}
        </div>
      </div>
    </a>
  );
}
