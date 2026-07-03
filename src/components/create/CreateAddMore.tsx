import * as Popover from '@radix-ui/react-popover';
import { BarChart3, Calendar, Camera, Link, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderButton } from '@/components/ui/HeaderButton';
import { ContextMenuButton, PopoverContent } from '@/components/ui/popover';

interface CreateAddMoreProps {
  onAddFiles?: () => void;
}

export function CreateAddMore({ onAddFiles }: CreateAddMoreProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (type: string) => {
    if (type === 'files') {
      onAddFiles?.();
      setIsOpen(false);
      return;
    }
    console.log('Adding content type:', type);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <HeaderButton
          icon={<Plus size={20} />}
          label={t('posts:addContent')}
          variant="persistent"
        />
      </Popover.Trigger>
      <Popover.Portal>
        <PopoverContent>
          <ContextMenuButton
            id="add-files"
            label={t('posts:addPhotosOrFiles')}
            icon={Camera}
            onClick={() => handleSelect('files')}
          />
          <ContextMenuButton
            id="add-link"
            label={t('posts:addLink')}
            icon={Link}
            onClick={() => handleSelect('link')}
          />
          <ContextMenuButton
            id="add-poll"
            label={t('posts:addPoll')}
            icon={BarChart3}
            onClick={() => handleSelect('poll')}
            disabled
          />
          <ContextMenuButton
            id="add-event"
            label={t('posts:addEvent')}
            icon={Calendar}
            onClick={() => handleSelect('event')}
            disabled
          />
        </PopoverContent>
      </Popover.Portal>
    </Popover.Root>
  );
}
