import type { Area } from 'react-easy-crop';

/**
 * Square sent to POST /avatar. The server re-encodes 256px;
 * 512px is the retina source for that pass.
 */
const AVATAR_EXPORT_SIZE = 512;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (/^https?:\/\//.test(src)) {
      image.crossOrigin = 'anonymous';
    }
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('image failed to load'));
    image.src = src;
  });
}

/**
 * Draws the cropper's pixel square into a PNG. Crop coordinates stay on the client.
 */
export async function renderCroppedAvatar(
  imageSrc: string,
  pixelCrop: Area,
): Promise<File> {
  if (pixelCrop.width <= 0 || pixelCrop.height <= 0) {
    throw new Error('empty crop');
  }

  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = AVATAR_EXPORT_SIZE;
  canvas.height = AVATAR_EXPORT_SIZE;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('canvas unavailable');
  }

  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    AVATAR_EXPORT_SIZE,
    AVATAR_EXPORT_SIZE,
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });
  if (!blob) {
    throw new Error('empty image');
  }

  return new File([blob], 'avatar.png', { type: 'image/png' });
}
