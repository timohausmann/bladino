import * as Popover from '@radix-ui/react-popover';
import { BarChart3, Calendar, Camera, Link, Plus } from "lucide-react";
import { useState } from "react";
import { HeaderButton } from "../ui/HeaderButton";
import { ContextMenuButton, PopoverContent } from "../ui/popover";

export function CreateAddMore() {

    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (type: string) => {
        console.log('Adding content type:', type);
    };

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <HeaderButton
                    icon={<Plus size={20} />}
                    label="Add content"
                    variant="persistent"
                />
            </Popover.Trigger>
            <Popover.Portal>
                <PopoverContent>
                    <ContextMenuButton
                        id="add-files"
                        label="Add photos or files"
                        icon={Camera}
                        onClick={() => handleSelect('files')}
                    />
                    <ContextMenuButton
                        id="add-link"
                        label="Add link"
                        icon={Link}
                        onClick={() => handleSelect('link')}
                    />
                    <ContextMenuButton
                        id="add-poll"
                        label="Add poll"
                        icon={BarChart3}
                        onClick={() => handleSelect('poll')}
                    />
                    <ContextMenuButton
                        id="add-event"
                        label="Add event"
                        icon={Calendar}
                        onClick={() => handleSelect('event')}
                    />
                </PopoverContent>
            </Popover.Portal>
        </Popover.Root>
    );
}