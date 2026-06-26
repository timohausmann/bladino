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

export function revokeDraftFiles(files: LocalDraftFile[]) {
  for (const draft of files) {
    revokeBlobUrl(draft.url);
  }
}

export function revokeBlobUrl(url: string) {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
