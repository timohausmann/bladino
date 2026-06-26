import { getAuthToken } from '@/stores/authStore';

export interface UploadFileOptions {
  channel?: string;
  parent?: string;
}

interface UploadResponse {
  id: string;
}

function resolveUploadUrl(): string {
  const configured = import.meta.env.VITE_UPLOAD_URL ?? '/upload';

  if (/^https?:\/\//.test(configured)) {
    return configured;
  }

  return new URL(configured, window.location.origin).href;
}

/** Upload a single file via REST; returns the server-assigned file ID. */
export async function uploadFile(
  file: globalThis.File,
  options: UploadFileOptions = {},
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  if (options.channel) {
    formData.append('channel', options.channel);
  }

  if (options.parent) {
    formData.append('parent', options.parent);
  }

  const headers: Record<string, string> = {};
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(resolveUploadUrl(), {
    method: 'POST',
    body: formData,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Upload failed (${response.status})`);
  }

  const data = (await response.json()) as UploadResponse;
  if (!data.id) {
    throw new Error('Upload response missing file id');
  }

  return data.id;
}

/** Upload multiple files in parallel; fails if any upload fails. */
export async function uploadFiles(
  files: globalThis.File[],
  options: UploadFileOptions = {},
): Promise<string[]> {
  return Promise.all(files.map((file) => uploadFile(file, options)));
}
