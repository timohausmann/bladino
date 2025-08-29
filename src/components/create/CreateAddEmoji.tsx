import * as Popover from '@radix-ui/react-popover';
import { SmilePlus } from 'lucide-react';
import { useState } from 'react';
import { EmojiPicker } from '../ui/EmojiPicker';
import { HeaderButton } from '../ui/HeaderButton';

interface CreateAddEmojiProps {
    onEmojiSelect: (emoji: string) => void;
}

/**
 * CreateAddEmoji - A simple component for adding emojis to posts during creation
 * Based on the working EmojiReaction pattern
 */
export function CreateAddEmoji({ onEmojiSelect }: CreateAddEmojiProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <HeaderButton
                    icon={<SmilePlus size={20} />}
                    label="Add emoji"
                    variant="persistent"
                />
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    className="z-50"
                    sideOffset={8}
                    align="start"
                >
                    <EmojiPicker
                        onEmojiSelect={onEmojiSelect}
                        onClose={() => setIsOpen(false)}
                    />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
