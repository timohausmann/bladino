import { HeaderButton } from '@/components/ui/HeaderButton';
import { headerButtonVariants } from '@/components/ui/headerButtonVariants';
import { ContextMenuButton, PopoverContent } from '@/components/ui/popover';
import {
  ALL_WIDGET_TYPES,
  useDashboardStore,
  type WidgetType,
} from '@/stores/dashboardStore';
import * as Popover from '@radix-ui/react-popover';
import * as Toolbar from '@radix-ui/react-toolbar';
import clsx from 'clsx';
import {
  CloudSun,
  Newspaper,
  Plus,
  Server,
  Trash2,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useState, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';

const WIDGET_ICONS: Record<WidgetType, LucideIcon> = {
  community: Users,
  weather: CloudSun,
  postOfTheDay: Newspaper,
  serverStatus: Server,
};

const WIDGET_LABEL_KEYS: Record<WidgetType, string> = {
  community: 'presence:community',
  weather: 'dashboard:weather',
  postOfTheDay: 'dashboard:postOfTheDay',
  serverStatus: 'dashboard:serverStatus',
};

interface DashboardToolbarProps {
  trashRef: RefObject<HTMLDivElement | null>;
  draggingId: WidgetType | null;
  overTrash: boolean;
}

export function DashboardToolbar({
  trashRef,
  draggingId,
  overTrash,
}: DashboardToolbarProps) {
  const { t } = useTranslation();
  const layout = useDashboardStore((store) => store.layout);
  const addWidget = useDashboardStore((store) => store.addWidget);
  const [open, setOpen] = useState(false);
  const activeIds = new Set(layout.map((item) => item.i));

  return (
    <Toolbar.Root
      className={clsx(
        'flex shrink-0 items-center',
        draggingId ? 'gap-4' : 'gap-0',
      )}
      aria-label={t('dashboard:toolbarLabel')}
    >
      <div
        ref={trashRef}
        aria-hidden={!draggingId}
        aria-label={t('dashboard:removeWidgetDrop')}
        className={clsx(
          headerButtonVariants({
            variant: 'dangerous',
            shape: 'round',
            active: overTrash,
          }),
          'bg-rose-500/10 dark:bg-rose-500/15',
          overTrash &&
            'bg-rose-500/20 ring-2 ring-rose-500 dark:bg-rose-500/25',
          !draggingId && 'pointer-events-none invisible',
        )}
      >
        <Trash2 size={18} aria-hidden />
      </div>

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Toolbar.Button asChild>
            <HeaderButton
              icon={<Plus size={18} />}
              label={t('dashboard:addWidget')}
              variant="persistent"
              disableTooltip
              aria-expanded={open}
              aria-haspopup="menu"
            />
          </Toolbar.Button>
        </Popover.Trigger>

        <PopoverContent width="w-56">
          {ALL_WIDGET_TYPES.map((type) => (
            <ContextMenuButton
              key={type}
              id={type}
              label={t(WIDGET_LABEL_KEYS[type])}
              icon={WIDGET_ICONS[type]}
              disabled={activeIds.has(type)}
              onClick={() => {
                if (activeIds.has(type)) {
                  return;
                }

                addWidget(type);
                setOpen(false);
              }}
            />
          ))}
        </PopoverContent>
      </Popover.Root>
    </Toolbar.Root>
  );
}
