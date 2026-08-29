import { SettingsSidebarHeader } from '@/components/settings/SettingsSidebarHeader';
import { SettingsSidebar } from '@/components/settings';
import { ContentFrame } from '@/components/layout/ContentFrame';
import { Outlet } from '@tanstack/react-router';

/**
 * Settings shell with sidebar navigation and nested content panels.
 */
export function SettingsLayout() {
  return (
    <ContentFrame
      sidebar={
        <>
          <SettingsSidebarHeader />
          <SettingsSidebar />
        </>
      }
    >
      <Outlet />
    </ContentFrame>
  );
}
