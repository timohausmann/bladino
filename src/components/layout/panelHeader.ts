import clsx from 'clsx';

/** 64px sidebar/context panel header row (Nav logo, Notes, Mails, Settings). */
export const panelSidebarHeaderClassName = clsx(
  'flex min-h-16 shrink-0 items-center gap-1 px-2',
);

/** 64px detail/content panel title row (mail subject, note title, settings page). */
export const contentPanelHeaderRowClassName = clsx(
  'flex min-h-16 shrink-0 items-center gap-2',
);

export const contentPanelHeaderClassName = clsx(
  contentPanelHeaderRowClassName,
  'px-6',
);

/** Shared title typography for all content panel headers. */
export const contentPanelTitleClassName = clsx(
  'min-w-0 truncate text-lg font-semibold leading-none text-neutral-900 dark:text-neutral-100',
);

/** Note title input — matches contentPanelTitleClassName. */
export const contentPanelTitleInputClassName = clsx(
  contentPanelTitleClassName,
  'flex-1 border-none bg-transparent p-0 placeholder:text-neutral-400 focus:outline-none dark:placeholder:text-neutral-500',
);

/** Sidebar panel label — matches InlineSelect trigger (e.g. Posteingang). */
export const panelSidebarLabelClassName = clsx(
  'min-w-0 truncate text-sm leading-none text-neutral-900 dark:text-neutral-100',
);

/** Settings sidebar header — aligned with sidebar nav padding (p-4). */
export const panelSidebarHeaderSettingsClassName = clsx(
  panelSidebarHeaderClassName,
  'px-4',
);
