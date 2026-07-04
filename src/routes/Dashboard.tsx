import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { DashboardGrid } from '@/components/dashboard';
import { UsersLastActionDocument, useGraphQLQuery } from '@/graphql';
import { useTranslation } from 'react-i18next';

/**
 * Customizable dashboard with draggable widgets on a dot grid.
 */
export function Dashboard() {
  const { t } = useTranslation();
  const { data: presenceData } = useGraphQLQuery(UsersLastActionDocument);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <header className="shrink-0">
        <h1 className="text-foreground text-2xl font-bold">
          {t('dashboard:title')}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t('dashboard:subtitle')}
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <DashboardGrid presenceUsers={presenceData?.usersLastAction ?? []} />
      </div>
    </div>
  );
}
