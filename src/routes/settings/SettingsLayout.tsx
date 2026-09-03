import { SettingsSidebarHeader } from '@/components/settings/SettingsSidebarHeader';
import { SettingsSidebar } from '@/components/settings';
import { ContentFrame } from '@/components/layout/ContentFrame';
import { Outlet, useRouterState } from '@tanstack/react-router';

/**
 * Settings shell with sidebar navigation and nested content panels.
 */
export function SettingsLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isSettingsIndex = pathname === '/settings' || pathname === '/settings/';

  return (
    <ContentFrame
      mobilePane={isSettingsIndex ? 'sidebar' : 'content'}
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
