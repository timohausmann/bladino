import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/button';
import { AVATAR_FALLBACK_SRC } from '@/utils/avatarUrl';
import { Folder, Trash2 } from 'lucide-react';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import Cropper, {
  type Area,
  type MediaSize,
  type Point,
  type Size,
} from 'react-easy-crop';
import { renderCroppedAvatar } from './renderCroppedAvatar';

/** Gap between the circular crop and the edge of the crop stage. */
const CROP_FRAME_INSET = 48;

/**
 * react-easy-crop leaves images smaller than the stage at their natural size.
 * This zoom scales them up until they cover the circle.
 */
function coverZoomFor(media: MediaSize, cropSize: Size): number {
  if (media.width <= 0 || media.height <= 0) {
    return 1;
  }

  return Math.max(cropSize.width / media.width, cropSize.height / media.height);
}

interface ProfileAvatarEditorProps {
  /** Resolved avatar URL. Empty when the profile has no avatar yet. */
  image?: string;
  onCancel: () => void;
  /** Receives the cropped square, or null when the avatar should be removed. */
  onSave: (file: File | null) => Promise<void>;
}

/**
 * Edit-avatar mode for the profile header.
 * Save uploads the visible square; crop coordinates are not sent.
 */
export function ProfileAvatarEditor({
  image,
  onCancel,
  onSave,
}: ProfileAvatarEditorProps) {
  const { t } = useTranslation();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const localObjectUrlRef = useRef<string | null>(null);

  const frameRef = useRef<HTMLDivElement>(null);
  const mediaSizeRef = useRef<MediaSize | null>(null);

  const [imageSrc, setImageSrc] = useState(image || AVATAR_FALLBACK_SRC);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropSize, setCropSize] = useState<Size | null>(null);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(3);
  const [isFitted, setIsFitted] = useState(false);
  const [cropPixels, setCropPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const isSavingRef = useRef(false);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== 'Escape' ||
        event.defaultPrevented ||
        isSavingRef.current
      ) {
        return;
      }

      onCancel();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  useEffect(() => {
    return () => {
      if (localObjectUrlRef.current) {
        URL.revokeObjectURL(localObjectUrlRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const measure = () => {
      const bounds = frame.getBoundingClientRect();
      const diameter = Math.round(
        Math.max(0, Math.min(bounds.width, bounds.height) - CROP_FRAME_INSET),
      );
      setCropSize((current) =>
        current?.width === diameter && current.height === diameter
          ? current
          : { width: diameter, height: diameter },
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [imageSrc]);

  useEffect(() => {
    const media = mediaSizeRef.current;
    if (!media || !cropSize) {
      return;
    }

    const nextMinZoom = coverZoomFor(media, cropSize);
    setMinZoom(nextMinZoom);
    setMaxZoom(Math.max(3, nextMinZoom * 3));
    setZoom((current) => (current < nextMinZoom ? nextMinZoom : current));
  }, [cropSize]);

  const resetCrop = () => {
    mediaSizeRef.current = null;
    setIsFitted(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setMinZoom(1);
    setMaxZoom(3);
    setCropPixels(null);
    setSaveError(null);
  };

  const handleMediaLoaded = (media: MediaSize) => {
    mediaSizeRef.current = media;
    if (!cropSize) {
      return;
    }

    const nextMinZoom = coverZoomFor(media, cropSize);
    setMinZoom(nextMinZoom);
    setMaxZoom(Math.max(3, nextMinZoom * 3));
    setZoom(nextMinZoom);
    setCrop({ x: 0, y: 0 });
    setIsFitted(true);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || (file.type && !file.type.startsWith('image/'))) {
      return;
    }

    if (localObjectUrlRef.current) {
      URL.revokeObjectURL(localObjectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    localObjectUrlRef.current = objectUrl;
    setImageSrc(objectUrl);
    resetCrop();
  };

  const isShowingFallback = imageSrc === AVATAR_FALLBACK_SRC;

  const handleDelete = () => {
    if (isShowingFallback || isSaving) {
      return;
    }

    if (localObjectUrlRef.current) {
      URL.revokeObjectURL(localObjectUrlRef.current);
      localObjectUrlRef.current = null;
    }

    setImageSrc(AVATAR_FALLBACK_SRC);
    resetCrop();
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    const removing = isShowingFallback;
    if (removing && !image) {
      return;
    }
    if (!removing && (!imageSrc || !cropPixels)) {
      return;
    }

    setIsSaving(true);
    isSavingRef.current = true;
    setSaveError(null);

    try {
      const file = removing
        ? null
        : await renderCroppedAvatar(imageSrc as string, cropPixels as Area);
      await onSave(file);
    } catch {
      setSaveError(t('profile:avatarSaveFailed'));
      setIsSaving(false);
      isSavingRef.current = false;
    }
  };

  const canSave = isShowingFallback
    ? Boolean(image)
    : Boolean(imageSrc && cropPixels);

  return (
    <div>
      <h2 ref={headingRef} tabIndex={-1} className="sr-only">
        {t('profile:editAvatar')}
      </h2>

      {imageSrc ? (
        // The cropper is absolutely positioned and needs a sized parent.
        <div
          ref={frameRef}
          className="relative h-80 w-full bg-black"
          role="group"
          aria-label={t('profile:editAvatar')}
        >
          {cropSize && cropSize.width > 0 ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              minZoom={minZoom}
              maxZoom={maxZoom}
              cropSize={cropSize}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_area, pixels) => setCropPixels(pixels)}
              onMediaLoaded={handleMediaLoaded}
              style={{
                containerStyle: { opacity: isFitted ? 1 : 0 },
              }}
            />
          ) : null}
        </div>
      ) : null}

      {saveError ? (
        <div className="px-4 pt-4">
          <Banner message={saveError} variant="negative" />
        </div>
      ) : null}

      <div className="flex justify-between px-4 py-6">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="dangerous"
            appearance="outline"
            iconBefore={<Trash2 size={16} />}
            onClick={handleDelete}
            disabled={!imageSrc || isShowingFallback || isSaving}
          >
            {t('profile:deleteAvatar')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            iconBefore={<Folder size={16} />}
            onClick={handleUploadClick}
            disabled={isSaving}
          >
            {t('profile:uploadAvatar')}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSaving}
          >
            {t('common:cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            loading={isSaving}
            disabled={!canSave}
          >
            {t('common:save')}
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden
        tabIndex={-1}
      />
    </div>
  );
}
