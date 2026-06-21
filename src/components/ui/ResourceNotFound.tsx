import clsx from 'clsx';

type ResourceKind = 'post' | 'user' | 'note';

const RESOURCE_COPY: Record<
    ResourceKind,
    { title: string; description: (detail?: string) => string }
> = {
    post: {
        title: 'Post Not Found',
        description: () => "The post you're looking for doesn't exist.",
    },
    user: {
        title: 'User Not Found',
        description: (detail) =>
            detail
                ? `The user ${detail} doesn't exist.`
                : "The user you're looking for doesn't exist.",
    },
    note: {
        title: 'Note Not Found',
        description: () => "The note you're looking for doesn't exist.",
    },
};

interface ResourceNotFoundProps {
    resource: ResourceKind;
    /** Optional context, e.g. username for user-not-found */
    detail?: string;
    className?: string;
}

/**
 * Centered not-found state for a missing resource (post, user, note).
 */
export function ResourceNotFound({ resource, detail, className }: ResourceNotFoundProps) {
    const { title, description } = RESOURCE_COPY[resource];

    return (
        <div className={clsx('text-center py-12', className)}>
            <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground">{description(detail)}</p>
        </div>
    );
}
