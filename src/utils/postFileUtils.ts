/** Local file attachment while composing or editing a post (not yet uploaded). */
export interface LocalDraftFile {
  id: string;
  url: string;
  filename: string;
  type?: string;
  size?: number;
}

export function fileToLocalDraft(file: globalThis.File): LocalDraftFile {
  return {
    id: crypto.randomUUID(),
    url: URL.createObjectURL(file),
    filename: file.name,
    type: file.type,
    size: file.size,
  };
}

export function revokeBlobUrl(url: string) {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
