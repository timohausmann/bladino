import { PostFile } from '@/types';

export function fileToPostFile(file: File): PostFile {
    return {
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        filename: file.name,
        type: file.type,
        size: file.size,
    };
}

export function revokeBlobUrl(url: string) {
    if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
    }
}
