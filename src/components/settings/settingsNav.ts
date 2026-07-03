import type { LucideIcon } from 'lucide-react';
import { KeyRound, LogOut, Monitor } from 'lucide-react';

export type SettingsNavItem = {
  to: string;
  labelKey: string;
  icon: LucideIcon;
  variant?: 'default' | 'danger';
};

export type SettingsNavGroup = {
  groupKey: string;
  items: SettingsNavItem[];
};

export const settingsNav: SettingsNavGroup[] = [
  {
    groupKey: 'settings:nav.general',
    items: [
      {
        to: '/settings/appearance',
        labelKey: 'settings:nav.display',
        icon: Monitor,
      },
    ],
  },
  {
    groupKey: 'settings:nav.account',
    items: [
      {
        to: '/settings/password',
        labelKey: 'settings:nav.password',
        icon: KeyRound,
      },
      {
        to: '/logout',
        labelKey: 'common:logout',
        icon: LogOut,
        variant: 'danger',
      },
    ],
  },
];
