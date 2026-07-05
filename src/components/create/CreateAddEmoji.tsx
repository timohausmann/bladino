import * as Popover from '@radix-ui/react-popover';
import { SmilePlus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyEmojiPicker } from '@/components/ui/LazyEmojiPicker';
import type {
  HeaderButtonShape,
  HeaderButtonVariant,
} from '@/components/ui/headerButtonVariants';
import { HeaderButton } from '@/components/ui/HeaderButton';

interface CreateAddEmojiProps {
  onEmojiSelect: (emoji: string) => void;
  variant?: HeaderButtonVariant;
  shape?: HeaderButtonShape;
  className?: string;
}

/**
 * CreateAddEmoji - A simple component for adding emojis to posts during creation
 * Based on the working EmojiReaction pattern
 */
export function CreateAddEmoji({
  onEmojiSelect,
  variant = 'default',
  shape = 'round',
  className,
}: CreateAddEmojiProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <HeaderButton
          icon={<SmilePlus size={20} />}
          label={t('posts:addEmoji')}
          variant={variant}
          shape={shape}
          className={className}
          disableTooltip
        />
      </Popover.Trigger>

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
