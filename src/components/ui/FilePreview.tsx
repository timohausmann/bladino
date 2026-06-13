import { PostFile } from "@/types";
import { File as FileIcon, FileText, Music, Video, X } from "lucide-react";

interface FilePreviewProps {
    files: PostFile[];
    /** When provided, shows a remove button on each preview (e.g. during post creation) */
    onRemove?: (fileId: string) => void;
}

/**
 * FilePreview - A component that displays files in a horizontally scrollable layout
 * Images are displayed as thumbnails, other files show generic icons with metadata
 */
export function FilePreview({ files, onRemove }: FilePreviewProps) {
    if (!files || files.length === 0) {
        return null;
    }

    // Helper function to check if file is an image
    const isImage = (type?: string) => {
        return type?.startsWith("image/");
    };

    // Helper function to format file size
    const formatFileSize = (bytes?: number) => {
        if (!bytes) return "Unknown size";

        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    };

    // Helper function to get file extension
    const getFileExtension = (filename: string) => {
        return filename.split('.').pop()?.toUpperCase() || '';
    };

    // Helper function to get appropriate icon for file type
    const getFileIcon = (type?: string) => {
        if (type?.startsWith("video/")) {
            return <Video size={32} className="text-cyan-500" />;
        } else if (type?.startsWith("audio/")) {
            return <Music size={32} className="text-cyan-500" />;
        } else if (type?.startsWith("application/pdf")) {
            return <FileText size={32} className="text-cyan-500" />;
        } else {
            return <FileIcon size={32} className="text-cyan-500" />;
        }
    };

    const previewClassName =
        "relative flex-shrink-0 w-1/2 md:w-1/3 aspect-3/2 bg-black/20 rounded-lg overflow-hidden transition-all duration-200";

    return (
        <div className="flex gap-3 overflow-x-auto pb-2">
            {files.map((file) => {
                const previewContent = isImage(file.type) ? (
                    <div className="w-full h-full">
                        <img
                            src={file.url}
                            alt={file.filename}
                            className="w-full h-full object-contain"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-3 text-center">
                        <div className="mb-2">
                            {getFileIcon(file.type)}
                        </div>
                        <div className="text-xs font-medium text-foreground truncate w-full">
                            {file.filename}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {file.type && getFileExtension(file.filename)} • {formatFileSize(file.size)}
                        </div>
                    </div>
                );

                return (
                    <div key={file.id} className={previewClassName}>
                        {onRemove ? (
                            <>
                                {previewContent}
                                <button
                                    type="button"
                                    onClick={() => onRemove(file.id)}
                                    className="absolute top-1.5 right-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                                    aria-label={`Remove ${file.filename}`}
                                >
                                    <X size={14} />
                                </button>
                            </>
                        ) : (
                            <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full h-full hover:bg-black/30"
                                aria-label={`Open ${file.filename}`}
                                tabIndex={0}
                            >
                                {previewContent}
                            </a>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
