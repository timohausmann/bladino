import type { File as ApiFile } from "@/graphql";
import { resolveFileUrl } from "@/utils/fileUrl";
import { File as FileIcon, FileText, Music, Video, X } from "lucide-react";
import type { LocalDraftFile } from "@/utils/postFileUtils";

type PreviewFile = Pick<ApiFile, "id" | "filename" | "name" | "type" | "size"> & {
  url?: string | null;
};

interface FilePreviewProps {
  files: Array<PreviewFile | LocalDraftFile>;
  /** When provided, shows a remove button on each preview (e.g. during post creation) */
  onRemove?: (fileId: string) => void;
}

function getDisplayName(file: PreviewFile | LocalDraftFile): string {
  if ("name" in file && file.name) {
    return file.name;
  }

  const filename = file.filename ?? "";
  return filename.split("/").pop() ?? filename;
}

function getPreviewUrl(file: PreviewFile | LocalDraftFile): string | undefined {
  if ("url" in file && file.url) {
    return file.url;
  }

  return resolveFileUrl(file.filename);
}

/**
 * FilePreview - A component that displays files in a horizontally scrollable layout
 * Images are displayed as thumbnails, other files show generic icons with metadata
 */
export function FilePreview({ files, onRemove }: FilePreviewProps) {
  if (!files || files.length === 0) {
    return null;
  }

  const isImage = (type?: string | null) => type?.startsWith("image/");

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "Unknown size";

    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "";
  };

  const getFileIcon = (type?: string | null) => {
    if (type?.startsWith("video/")) {
      return <Video size={32} className="text-cyan-500" />;
    }
    if (type?.startsWith("audio/")) {
      return <Music size={32} className="text-cyan-500" />;
    }
    if (type?.startsWith("application/pdf")) {
      return <FileText size={32} className="text-cyan-500" />;
    }
    return <FileIcon size={32} className="text-cyan-500" />;
  };

  const previewClassName =
    "relative flex-shrink-0 w-1/2 md:w-1/3 aspect-3/2 bg-black/20 rounded-lg overflow-hidden transition-all duration-200";

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {files.map((file) => {
        const displayName = getDisplayName(file);
        const previewUrl = getPreviewUrl(file);

        const previewContent = isImage(file.type) && previewUrl ? (
          <div className="w-full h-full">
            <img
              src={previewUrl}
              alt={displayName}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-3 text-center">
            <div className="mb-2">{getFileIcon(file.type)}</div>
            <div className="text-xs font-medium text-foreground truncate w-full">
              {displayName}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {file.type && getFileExtension(displayName)} • {formatFileSize(file.size)}
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
                  aria-label={`Remove ${displayName}`}
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <a
                href={previewUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full hover:bg-black/30"
                aria-label={`Open ${displayName}`}
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
