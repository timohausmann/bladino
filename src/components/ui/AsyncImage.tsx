import { Spinner } from '@/components/ui/Spinner';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type ImageLoadStatus = 'loading' | 'loaded' | 'error';

export interface AsyncImageProps {
  src: string;
  alt: string;
  /** Wrapper sizing and layout — consumer controls dimensions (e.g. h-40 w-full). */
  className?: string;
  /** Applied to the underlying <img> (e.g. object-contain vs object-cover). */
  imgClassName?: string;
  spinnerSize?: number;
  /** When true (default), the component unmounts entirely on load failure. */
  hideOnError?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Remote image with loading spinner, fade-in on success, and optional removal on error.
 * The wrapper is sizing-agnostic (w-full h-full); pass className to define the box.
 */
export function AsyncImage({
  src,
  alt,
  className,
  imgClassName,
  spinnerSize = 24,
  hideOnError = true,
  onLoad,
  onError,
}: AsyncImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<ImageLoadStatus>('loading');

  useEffect(() => {
    const img = imgRef.current;
    if (!img) {
      setStatus('loading');
      return;
    }

    // Cached images may already be complete before handlers attach.
    if (img.complete) {
      setStatus(img.naturalWidth > 0 ? 'loaded' : 'error');
      return;
    }

    setStatus('loading');
  }, [src]);

  useEffect(() => {
    if (status === 'loaded') {
      onLoad?.();
    }
    if (status === 'error') {
      onError?.();
    }
  }, [status, onLoad, onError]);

  if (status === 'error' && hideOnError) {
    return null;
  }

  return (
    <div
      className={twMerge(
        'relative flex h-full w-full items-center justify-center overflow-hidden',
        className,
      )}
    >
      {status === 'loading' && (
        <Spinner size={spinnerSize} className="relative z-10" />
      )}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={twMerge(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
          status === 'loaded' ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </div>
  );
}
