import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

type ResourceKind = 'post' | 'user' | 'note' | 'mail';

interface ResourceNotFoundProps {
  resource: ResourceKind;
  /** Optional context, e.g. username for user-not-found */
  detail?: string;
  className?: string;
}

/**
 * Centered not-found state for a missing resource (post, user, note, mail).
 */
export function ResourceNotFound({
  resource,
  detail,
  className,
}: ResourceNotFoundProps) {
  const { t } = useTranslation();

  const description =
    resource === 'user' && detail
      ? t('errors:notFound.user.descriptionWithName', { name: detail })
      : t(`errors:notFound.${resource}.description`);

  return (
    <div className={clsx('py-12 text-center', className)}>
      <h1 className="text-foreground mb-2 text-2xl font-bold">
        {t(`errors:notFound.${resource}.title`)}
      </h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
