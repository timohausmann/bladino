export interface IsAliveResponse {
  server: boolean;
  database: boolean;
}

function resolveIsAliveUrl(): string {
  const configured = import.meta.env.VITE_ISALIVE_URL ?? '/isalive';

  if (/^https?:\/\//.test(configured)) {
    return configured;
  }

  return new URL(configured, window.location.origin).href;
}

const isAliveUrl = resolveIsAliveUrl();

/** Queries the backend health endpoint. */
export async function fetchServerStatus(): Promise<IsAliveResponse> {
  const response = await fetch(isAliveUrl, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Server status check failed (${response.status})`);
  }

  return (await response.json()) as IsAliveResponse;
}
