const FILE_BASE_PATH = "/upload";

/**
 * Resolves a file filename from the API to a browser URL.
 * Pass-through for already-resolved paths and external URLs.
 */
export function resolveFileUrl(filename?: string | null): string | undefined {
    if (!filename) {
        return undefined;
    }

    if (
        filename.startsWith("/") ||
        filename.startsWith("http://") ||
        filename.startsWith("https://") ||
        filename.startsWith("blob:")
    ) {
        return filename;
    }

    return `${FILE_BASE_PATH}/${filename}`;
}
