import * as Popover from '@radix-ui/react-popover';
import { SmilePlus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyEmojiPicker } from '@/components/ui/EmojiPicker/LazyEmojiPicker';
import {
  IconButton,
  type IconButtonShape,
  type IconButtonVariant,
} from '@/components/ui/IconButton';
import { Tooltip } from '@/components/ui/Tooltip';

interface CreateAddEmojiProps {
  onEmojiSelect: (emoji: string) => void;
  variant?: IconButtonVariant;
  shape?: IconButtonShape;
  className?: string;
}

/**
 * CreateAddEmoji - A simple component for adding emojis to posts during creation
 * Based on the working EmojiReaction pattern
 */
export function CreateAddEmoji({
  onEmojiSelect,
  variant = 'default',
  shape = 'circle',
  className,
}: CreateAddEmojiProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const label = t('posts:addEmoji');

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip content={label}>
        <Popover.Trigger asChild>
          <IconButton
            icon={<SmilePlus size={20} />}
            label={label}
            variant={variant}
            shape={shape}
            className={className}
            disableTooltip
            aria-expanded={isOpen}
            aria-haspopup="dialog"
          />
        </Popover.Trigger>
      </Tooltip>

      <Popover.Portal>
        <Popover.Content className="z-50" sideOffset={8} align="start">
          <LazyEmojiPicker
            onEmojiSelect={onEmojiSelect}
            onClose={() => setIsOpen(false)}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
