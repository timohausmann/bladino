import { Card } from '@/components/ui/Card';
import { useTranslation } from 'react-i18next';

export function NotFound() {
  const { t } = useTranslation();

  return (
    <Card className="p-6">
      <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
        {t('errors:pageNotFound.title')}
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400">
        {t('errors:pageNotFound.description')}
      </p>
    </Card>
  );
}
