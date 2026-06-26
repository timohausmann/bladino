import type { Weblink } from '@/graphql';
import { LinkPreview } from '@/components/ui/LinkPreview';
import React from 'react';

interface WeblinkMatch {
  start: number;
  end: number;
  alias: string;
  weblink: Weblink;
}

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
      </a>,
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

/**
 * Splits plain text into nodes, turning newline characters into <br /> elements.
 */
function renderTextWithLineBreaks(
  text: string,
  keyPrefix: string,
): React.ReactNode[] {
  if (!text) {
    return [];
  }

  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    if (index > 0) {
      nodes.push(<br key={`${keyPrefix}-br-${index}`} />);
    }
    if (line) {
      nodes.push(line);
    }
  });

  return nodes;
}

/** Collects non-overlapping weblink alias matches ordered by position in the body. */
function collectWeblinkMatches(
  body: string,
  weblinks?: Array<Weblink | null> | null,
): WeblinkMatch[] {
  const matches: WeblinkMatch[] = [];

  for (const weblink of weblinks ?? []) {
    if (!weblink) {
      continue;
    }

    for (const alias of weblink.alias ?? []) {
      if (!alias) {
        continue;
      }

      let searchFrom = 0;
      while (searchFrom < body.length) {
        const index = body.indexOf(alias, searchFrom);
        if (index === -1) {
          break;
        }

        matches.push({
          start: index,
          end: index + alias.length,
          alias,
          weblink,
        });
        searchFrom = index + alias.length;
      }
    }
  }

  matches.sort((a, b) => {
    if (a.start !== b.start) {
      return a.start - b.start;
    }
    return b.end - b.start - (a.end - a.start);
  });

  const nonOverlapping: WeblinkMatch[] = [];
  let lastIndex = 0;

  for (const match of matches) {
    if (match.start >= lastIndex) {
      nonOverlapping.push(match);
      lastIndex = match.end;
    }
  }

  return nonOverlapping;
}

/**
 * Parses comment body text into React nodes, replacing weblink aliases with LinkPreview cards.
 * @param body Comment text
 * @param weblinks Weblink metadata from the API (matched by alias strings in body)
 */
export function parseCommentBody(
  body: string,
  weblinks?: Array<Weblink | null> | null,
): React.ReactNode[] {
  if (!body) {
    return [];
  }

  const matches = collectWeblinkMatches(body, weblinks);

  if (matches.length === 0) {
    return renderTextWithLineBreaks(body, 'text');
  }

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    if (match.start > lastIndex) {
      nodes.push(
        ...renderTextWithLineBreaks(
          body.slice(lastIndex, match.start),
          `text-${lastIndex}`,
        ),
      );
    }

    const { weblink, alias } = match;
    nodes.push(
      <LinkPreview
        key={`preview-${match.start}-${index}`}
        url={weblink.url || alias}
        title={weblink.title ?? undefined}
        description={weblink.descr ?? undefined}
        image={weblink.image ?? undefined}
        icon={weblink.icon ?? undefined}
      />,
    );

    lastIndex = match.end;
  });

  if (lastIndex < body.length) {
    nodes.push(
      ...renderTextWithLineBreaks(body.slice(lastIndex), `text-${lastIndex}`),
    );
  }

  return nodes;
}
