import { authorizedFetch } from '@/lib/authorizedFetch';

interface AvatarUploadResponse {
  avatar: string;
}

function resolveAvatarUploadUrl(): string {
  const configured = import.meta.env.VITE_AVATAR_UPLOAD_URL ?? '/avatar';

  if (/^https?:\/\//.test(configured)) {
    return configured;
  }

  return new URL(configured, window.location.origin).href;
}

/** Removes the stored avatar file and clears it on the user. */
export async function deleteAvatar(): Promise<null> {
  const response = await authorizedFetch(resolveAvatarUploadUrl(), {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Avatar delete failed (${response.status})`);
  }

  return null;
}

/** Sends the cropped square. Returns the filename stored on the user. */
export async function uploadAvatar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await authorizedFetch(resolveAvatarUploadUrl(), {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Avatar upload failed (${response.status})`);
  }

  const data = (await response.json()) as AvatarUploadResponse;
  if (!data.avatar) {
    throw new Error('Avatar upload response missing filename');
  }

  return data.avatar;
}
