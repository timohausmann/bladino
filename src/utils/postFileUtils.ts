import type { File as ApiFile } from '@/graphql';
import { uploadFile, type UploadFileOptions } from '@/utils/uploadFile';

/** Max attachments per comment (matches backend validation). */
export const MAX_COMMENT_FILES = 3;

/** Local file attachment while composing or editing a post (not yet uploaded). */
export interface LocalDraftFile {
  id: string;
  file: globalThis.File;
  url: string;
  filename: string;
  type?: string;
  size?: number;
}

/** File in the composer: existing server file or a new local draft. */
export type ComposerFile = ApiFile | LocalDraftFile;

export function isLocalDraftFile(file: ComposerFile): file is LocalDraftFile {
  return 'file' in file && file.file instanceof File;
}

export function fileToLocalDraft(file: globalThis.File): LocalDraftFile {
  return {
    id: crypto.randomUUID(),
    file,
    url: URL.createObjectURL(file),
    filename: file.name,
    type: file.type,
    size: file.size,
  };
}

export function revokeDraftFiles(files: Iterable<LocalDraftFile>) {
  for (const draft of files) {
    revokeBlobUrl(draft.url);
  }
}

/** Revoke blob URLs for all local drafts in the composer. */
export function revokeLocalDrafts(files: Iterable<ComposerFile>) {
  for (const file of files) {
    if (isLocalDraftFile(file)) {
      revokeBlobUrl(file.url);
    }
  }
}

export function revokeBlobUrl(url: string) {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/** True when file lists have the same IDs in the same order. */
export function filesUnchanged(
  current: ComposerFile[],
  initial: ComposerFile[],
): boolean {
  if (current.length !== initial.length) {
    return false;
  }
  return current.every((file, index) => file.id === initial[index]?.id);
}

/** Resolve composer files to server IDs — uploads new drafts, keeps existing IDs. */
export async function resolveComposerFileIds(
  files: ComposerFile[],
  options: UploadFileOptions = {},
): Promise<string[]> {
  const ids: string[] = [];

  for (const file of files) {
    if (isLocalDraftFile(file)) {
      ids.push(await uploadFile(file.file, options));
    } else {
      ids.push(file.id);
    }
  }

  return ids;
}
