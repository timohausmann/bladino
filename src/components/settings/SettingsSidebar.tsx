import { settingsNav } from '@/components/settings/settingsNav';
import { Link, useRouterState } from '@tanstack/react-router';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

/**
 * Grouped navigation for settings sub-pages.
 */
export function SettingsSidebar() {
  const { t } = useTranslation();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <nav
      className="flex flex-col gap-5 overflow-auto p-4"
      aria-label={t('settings:title')}
    >
      {settingsNav.map((group) => (
        <div key={group.groupKey}>
          <p className="mb-2 px-3 text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
            {t(group.groupKey)}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = pathname === item.to;
              const isDanger = item.variant === 'danger';

              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={clsx(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                      isActive
                        ? 'bg-black/5 text-neutral-900 dark:bg-white/5 dark:text-neutral-100'
                        : isDanger
                          ? 'text-rose-600 hover:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/10'
                          : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/60',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon
                      size={16}
                      className={clsx(
                        'shrink-0',
                        isDanger
                          ? 'text-rose-500 dark:text-rose-400'
                          : 'text-neutral-400 dark:text-neutral-500',
                      )}
                      aria-hidden
                    />
                    <span className="truncate">{t(item.labelKey)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
