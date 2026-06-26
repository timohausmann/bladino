import clsx from 'clsx';

type ResourceKind = 'post' | 'user' | 'note';

const RESOURCE_COPY: Record<ResourceKind, { title: string; fallback: string }> =
  {
    post: {
      title: 'Could not load post',
      fallback: 'Something went wrong while loading this post.',
    },
    user: {
      title: 'Could not load profile',
      fallback: 'Something went wrong while loading this profile.',
    },
    note: {
      title: 'Could not load note',
      fallback: 'Something went wrong while loading this note.',
    },
  };

interface ResourceErrorProps {
  resource: ResourceKind;
  /** Override the default fallback description, e.g. from a GraphQL error message */
  message?: string;
  className?: string;
}

/**
 * Centered load-error state for a resource fetch failure (post, user, note).
 */
export function ResourceError({
  resource,
  message,
  className,
}: ResourceErrorProps) {
  const { title, fallback } = RESOURCE_COPY[resource];

  return (
    <div className={clsx('py-12 text-center', className)}>
      <h1 className="text-foreground mb-2 text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{message ?? fallback}</p>
    </div>
  );
}
