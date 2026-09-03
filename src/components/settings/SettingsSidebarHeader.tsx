import {
  panelSidebarHeaderSettingsClassName,
  panelSidebarLabelClassName,
} from '@/components/layout/panelHeader';
import { useTranslation } from 'react-i18next';

/**
 * Settings sidebar title row — matches sidebar nav padding and mailbox select typography.
 */
export function SettingsSidebarHeader() {
  const { t } = useTranslation();

  return (
    <div className={panelSidebarHeaderSettingsClassName}>
      <span className={panelSidebarLabelClassName}>{t('settings:title')}</span>
    </div>
  );
}
