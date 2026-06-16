/** Formats API date values for display in post headers and comments. */
export function formatCommentDate(date: unknown): string {
  if (!date) {
    return "";
  }

  const parsed = new Date(date as string | number);
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
export function formatJoinDate(date: unknown): string {
  if (!date) {
    return "";
  }

  const parsed = new Date(date as string | number);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}
