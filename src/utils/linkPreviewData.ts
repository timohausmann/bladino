/**
 * Mock link preview data for different domains
 * In a real application, this would be fetched from the actual URLs
 */
interface LinkPreviewData {
  title: string;
  description: string;
  image: string;
  siteName: string;
}

// Map of domains to their preview data
const domainPreviewMap: Record<string, LinkPreviewData> = {
  "example.com": {
    title: "Example Website - Your Source for Examples",
    description:
      "This is a mock preview for example.com. In a real application, this data would be retrieved from the actual website metadata.",
    image: "https://dummyimage.com/600x400/000/fff.jpg&text=Example+Website",
    siteName: "Example",
  },
  "medium.com": {
    title: "Responsive Design Patterns for Modern Web Applications",
    description:
      "Learn how to implement responsive design patterns that work across all devices and screen sizes. This comprehensive guide covers everything from fluid grids to advanced CSS techniques.",
    image: "https://dummyimage.com/600x400/000/fff.jpg&text=Medium+Article",
    siteName: "Medium",
  },
  "unsplash.com": {
    title: "Beautiful Free Images & Pictures | Unsplash",
    description:
      "Beautiful, free images and photos that you can download and use for any project. Better than any royalty free or stock photos.",
    image: "https://dummyimage.com/600x400/000/fff.jpg&text=Unsplash",
    siteName: "Unsplash",
  },
  "google.com": {
    title: "Google",
    description:
      "Search the world's information, including webpages, images, videos and more.",
    image: "https://dummyimage.com/600x400/000/fff.jpg&text=Google",
    siteName: "Google",
  },
};

/**
 * Get preview data for a URL
 * @param url URL to get preview data for
 * @returns Link preview data or default data if domain is not recognized
 */
export function getLinkPreviewData(url: string): LinkPreviewData {
  try {
    // Extract the domain from the URL
    const hostname = new URL(url).hostname;

    // Look for the domain or subdomain in our map
    const domainKey = Object.keys(domainPreviewMap).find((domain) =>
      hostname.includes(domain)
    );

    // Return preview data for the domain or default data
    return domainKey
      ? domainPreviewMap[domainKey]
      : {
          title: "Link Preview",
          description:
            "This is a preview of the linked content. In a real app, this would show metadata from the actual URL.",
          image:
            "https://via.placeholder.com/600x400/a3a3a3/ffffff?text=Link+Preview",
          siteName: hostname.replace("www.", ""),
        };
  } catch (error) {
    // Return default data if URL parsing fails
    return {
      title: "Link Preview",
      description: "This is a preview of the linked content.",
      image:
        "https://via.placeholder.com/600x400/a3a3a3/ffffff?text=Link+Preview",
      siteName: "website",
    };
  }
}
