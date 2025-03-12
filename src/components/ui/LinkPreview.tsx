import { useMemo } from "react";
import { ExternalLink } from "react-feather";
import { getLinkPreviewData } from "../../utils/linkPreviewData";

interface LinkPreviewProps {
    url: string;
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
}

/**
 * LinkPreview - A component that displays a preview of a linked website
 * Uses mock data from our linkPreviewData utility
 * On tablets and larger screens (md breakpoint), displays image and content in a single row
 */
export function LinkPreview({
    url,
    title,
    description,
    image,
    siteName,
}: LinkPreviewProps) {
    // Get preview data for the URL using our mock service
    const previewData = useMemo(() => {
        const data = getLinkPreviewData(url);
        return {
            title: title || data.title,
            description: description || data.description,
            image: image || data.image,
            siteName: siteName || data.siteName,
        };
    }, [url, title, description, image, siteName]);

    // Extract domain for display
    const domain = useMemo(() => {
        try {
            return new URL(url).hostname.replace("www.", "");
        } catch (e) {
            return "website";
        }
    }, [url]);

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 mb-4 block text-inherit no-underline"
            aria-label={`Visit ${previewData.title || "website"}`}
            tabIndex={0}
        >
            <div className="flex flex-col overflow-hidden rounded-lg bg-black/10 transition-all duration-200 hover:bg-black/20 hover:shadow-md md:flex-row">
                {/* Image - Full width on mobile, fixed width on md+ */}
                {previewData.image && (
                    <div className="bg-black/10 h-40 w-full flex-shrink-0 overflow-hidden md:w-1/3 md:max-w-[240px]">
                        <img
                            src={previewData.image}
                            alt={previewData.title || "Link preview image"}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}

                {/* Content - Takes remaining space */}
                <div className="flex-grow p-3 md:p-4">
                    {/* Site info */}
                    <div className="text-muted-foreground mb-2 flex items-center text-sm">
                        <span>{previewData.siteName || domain}</span>
                        <ExternalLink size={14} className="ml-1.5" />
                    </div>

                    {/* Title */}
                    <h3 className="text-foreground m-0 mb-2 text-base leading-tight font-semibold">
                        {previewData.title}
                    </h3>

                    {/* Description */}
                    {previewData.description && (
                        <p className="text-muted-foreground m-0 line-clamp-2 text-sm leading-normal">
                            {previewData.description}
                        </p>
                    )}
                </div>
            </div>
        </a>
    );
}
