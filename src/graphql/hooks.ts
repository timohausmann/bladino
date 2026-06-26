import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { requestGraphQL } from './client';

function getOperationName(
  document: TypedDocumentNode<unknown, unknown>,
): string {
  const definition = document.definitions[0];
  return definition && 'name' in definition && definition.name
    ? definition.name.value
    : 'anonymous';
}

export function useGraphQLQuery<TResult, TVariables extends object>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  options?: Omit<UseQueryOptions<TResult>, 'queryKey' | 'queryFn'>,
) {
  const operationName = getOperationName(
    document as TypedDocumentNode<unknown, unknown>,
  );

  return useQuery({
    queryKey: [operationName, variables],
    queryFn: () => requestGraphQL(document, variables),
    ...options,
  });
}

export function useGraphQLMutation<TResult, TVariables extends object>(
  document: TypedDocumentNode<TResult, TVariables>,
  options?: Omit<UseMutationOptions<TResult, Error, TVariables>, 'mutationFn'>,
) {
  const operationName = getOperationName(
    document as TypedDocumentNode<unknown, unknown>,
  );

  return useMutation({
    mutationKey: [operationName],
    mutationFn: (variables: TVariables) => requestGraphQL(document, variables),
    ...options,
  });
}
