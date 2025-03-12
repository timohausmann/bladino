import React from 'react';

/**
 * Maximum length for displayed URLs
 */
const MAX_URL_LENGTH = 30;

/**
 * Regular expression to detect URLs in text
 */
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

/**
 * Truncates a URL if it's too long
 * @param url The URL to truncate
 * @returns Truncated URL with ellipsis if needed
 */
export function truncateUrl(url: string): string {
    if (url.length <= MAX_URL_LENGTH) {
        return url;
    }

    // Keep protocol and some of the domain
    const firstPart = url.substring(0, MAX_URL_LENGTH - 3);
    return `${firstPart}...`;
}

/**
 * Splits text content into an array of text nodes and link elements
 * @param text The text content to parse
 * @returns An array of React nodes (strings and link elements)
 */
export function parseTextWithLinks(text: string): React.ReactNode[] {
    if (!text) return [];

    // Split the text by URLs
    const parts = text.split(URL_REGEX);

    // Find all URLs using the regex
    const urls = text.match(URL_REGEX) || [];

    // Combine the parts and URLs into a single array of React nodes
    const result: React.ReactNode[] = [];

    parts.forEach((part, index) => {
        if (part) {
            result.push(part);
        }

        if (urls[index]) {
            const url = urls[index];
            result.push(
                <a
                    key={`link-${index}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-words"
                >
                    {truncateUrl(url)}
                </a>
            );
        }
    });

    return result;
}

/**
 * Extracts the first URL from a text string
 * @param text The text to extract URL from
 * @returns The first URL found or null if none
 */
export function extractFirstUrl(text: string): string | null {
    const match = text.match(URL_REGEX);
    return match ? match[0] : null;
} 