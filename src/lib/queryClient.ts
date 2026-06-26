import { isRetryableGraphQLError } from '@/graphql/errors';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        isRetryableGraphQLError(error) && failureCount < 3,
    },
  },
});
