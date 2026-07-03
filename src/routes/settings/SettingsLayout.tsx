import { SettingsSidebar } from '@/components/settings';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Outlet } from '@tanstack/react-router';

/**
 * Settings shell with sidebar navigation and nested content panels.
 */
export function SettingsLayout() {
  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
      <SidebarLayout sidebar={<SettingsSidebar />}>
        <Outlet />
      </SidebarLayout>
    </div>
  );
}
