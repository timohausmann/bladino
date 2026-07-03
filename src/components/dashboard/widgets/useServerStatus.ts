import { fetchServerStatus } from '@/lib/serverStatus';
import { useQuery } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';

const SERVER_STATUS_STALE_TIME_MS = 15_000;
const SERVER_STATUS_REFETCH_INTERVAL_MS = 30_000;

function subscribeToOnlineStatus(onStoreChange: () => void) {
  window.addEventListener('online', onStoreChange);
  window.addEventListener('offline', onStoreChange);

  return () => {
    window.removeEventListener('online', onStoreChange);
    window.removeEventListener('offline', onStoreChange);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

/** Tracks browser connectivity and polls the backend /isalive endpoint. */
export function useServerStatus() {
  const isBrowserOnline = useSyncExternalStore(
    subscribeToOnlineStatus,
    getOnlineSnapshot,
    getServerSnapshot,
  );

  const query = useQuery({
    queryKey: ['serverStatus'],
    queryFn: fetchServerStatus,
    enabled: isBrowserOnline,
    staleTime: SERVER_STATUS_STALE_TIME_MS,
    refetchInterval: SERVER_STATUS_REFETCH_INTERVAL_MS,
    retry: 1,
  });

  return {
    isBrowserOnline,
    ...query,
  };
}
