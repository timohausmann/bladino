/** ISO 8601 date string from the GraphQL Date scalar. */
export type ApiDate = string | null | undefined;

/** Formats API date values for display in post headers and comments. */
export function formatCommentDate(date: ApiDate): string {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Formats a join date for profile pages. */
export function formatJoinDate(date: ApiDate): string {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}
