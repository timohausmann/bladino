import { HeaderButton } from '@/components/ui/HeaderButton';
import * as Toolbar from '@radix-ui/react-toolbar';
import { ArrowDownAZ, Plus, Search } from 'lucide-react';

interface NotesSidebarToolbarProps {
  onCreate: () => void;
  isCreating?: boolean;
}

export function NotesSidebarToolbar({
  onCreate,
  isCreating = false,
}: NotesSidebarToolbarProps) {
  return (
    <Toolbar.Root
      className="flex shrink-0 items-center gap-1 border-b border-neutral-200 p-2 dark:border-neutral-800"
      aria-label="Notes list actions"
    >
      <Toolbar.Button asChild>
        <HeaderButton
          icon={<Plus size={18} />}
          label="New note"
          variant="persistent"
          onClick={onCreate}
          disabled={isCreating}
        />
      </Toolbar.Button>
      <div className="ml-auto flex items-center gap-1">
        <Toolbar.Button asChild disabled>
          <HeaderButton
            icon={<Search size={18} />}
            label="Search notes"
            variant="default"
            disabled
          />
        </Toolbar.Button>
        <Toolbar.Button asChild disabled>
          <HeaderButton
            icon={<ArrowDownAZ size={18} />}
            label="Sort notes"
            variant="default"
            disabled
          />
        </Toolbar.Button>
      </div>
    </Toolbar.Root>
  );
}
