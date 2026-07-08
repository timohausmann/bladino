import { SettingsSidebarHeader } from '@/components/settings/SettingsSidebarHeader';
import { SettingsSidebar } from '@/components/settings';
import { ContentFrame } from '@/components/layout/ContentFrame';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Outlet } from '@tanstack/react-router';

/**
 * Settings shell with sidebar navigation and nested content panels.
 */
export function SettingsLayout() {
  return (
    <ContentFrame>
      <SidebarLayout
        sidebar={
          <>
            <SettingsSidebarHeader />
            <SettingsSidebar />
          </>
        }
      >
        <Outlet />
      </SidebarLayout>
    </ContentFrame>
  );
}
