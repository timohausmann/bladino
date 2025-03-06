import React, { useMemo } from 'react';
import { ExternalLink } from 'react-feather';
import { getLinkPreviewData } from '../../utils/linkPreviewData';

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
 */
export function LinkPreview({ url, title, description, image, siteName }: LinkPreviewProps) {
    // Get preview data for the URL using our mock service
    const previewData = useMemo(() => {
        const data = getLinkPreviewData(url);
        return {
            title: title || data.title,
            description: description || data.description,
            image: image || data.image,
            siteName: siteName || data.siteName
        };
    }, [url, title, description, image, siteName]);

    // Extract domain for display
    const domain = useMemo(() => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch (e) {
            return 'website';
        }
    }, [url]);

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block no-underline text-inherit mb-4 mt-2"
        >
            <div className="border border-border rounded-lg overflow-hidden bg-card transition-shadow duration-200">
                {/* Image */}
                {previewData.image && (
                    <div className="w-full h-40 overflow-hidden bg-muted">
                        <img
                            src={previewData.image}
                            alt={previewData.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="p-3">
                    {/* Site info */}
                    <div className="flex items-center mb-2 text-muted-foreground text-sm">
                        <span>{previewData.siteName || domain}</span>
                        <ExternalLink size={14} className="ml-1.5" />
                    </div>

                    {/* Title */}
                    <h3 className="m-0 mb-2 text-base font-semibold text-foreground leading-tight">
                        {previewData.title}
                    </h3>

                    {/* Description */}
                    {previewData.description && (
                        <p className="m-0 text-muted-foreground text-sm leading-normal line-clamp-2">
                            {previewData.description}
                        </p>
                    )}
                </div>
            </div>
        </a>
    );
} 