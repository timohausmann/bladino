import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

type ResourceKind = 'post' | 'user' | 'note' | 'mail';

interface ResourceErrorProps {
  resource: ResourceKind;
  /** Override the default fallback description, e.g. from a GraphQL error message */
  message?: string;
  className?: string;
}

/**
 * Centered load-error state for a resource fetch failure (post, user, note, mail).
 */
export function ResourceError({
  resource,
  message,
  className,
}: ResourceErrorProps) {
  const { t } = useTranslation();

  return (
    <div className={clsx('py-12 text-center', className)}>
      <h1 className="text-foreground mb-2 text-2xl font-bold">
        {t(`errors:load.${resource}.title`)}
      </h1>
      <p className="text-muted-foreground">
        {message ?? t(`errors:load.${resource}.fallback`)}
      </p>
    </div>
  );
}
