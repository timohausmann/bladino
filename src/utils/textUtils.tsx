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

    const result: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    // Reset the regex before using it with exec
    URL_REGEX.lastIndex = 0;

    // Find each URL match and process the text before and including the URL
    while ((match = URL_REGEX.exec(text)) !== null) {
        const url = match[0];
        const matchIndex = match.index;

        // Add the text before the URL
        if (matchIndex > lastIndex) {
            result.push(text.substring(lastIndex, matchIndex));
        }

        // Add the URL as a link element
        result.push(
            <a
                key={`link-${matchIndex}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-words text-cyan-400"
            >
                {truncateUrl(url)}
            </a>
        );

        // Update the last index to after this URL
        lastIndex = matchIndex + url.length;
    }

    // Add any remaining text after the last URL
    if (lastIndex < text.length) {
        result.push(text.substring(lastIndex));
    }

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