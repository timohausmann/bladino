import { EmojiPicker as FrimoussePicker } from "frimousse";

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void;
    onClose: () => void;
}

export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
    return (
        <FrimoussePicker.Root
            className="isolate flex h-[368px] w-fit flex-col bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700"
            onEmojiSelect={(emoji) => {
                onEmojiSelect(emoji.emoji);
                onClose();
            }}
        >
            <FrimoussePicker.Search className="z-10 mx-2 mt-2 appearance-none rounded-md bg-neutral-100 px-2.5 py-2 text-sm dark:bg-neutral-800" />
            <FrimoussePicker.Viewport className="relative flex-1 outline-hidden">
                <FrimoussePicker.Loading className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm dark:text-neutral-500">
                    Loading…
                </FrimoussePicker.Loading>
                <FrimoussePicker.Empty className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm dark:text-neutral-500">
                    No emoji found.
                </FrimoussePicker.Empty>
                <FrimoussePicker.List
                    className="select-none pb-1.5"
                    components={{
                        CategoryHeader: ({ category, ...props }) => (
                            <div
                                className="bg-white px-3 pt-3 pb-1.5 font-medium text-neutral-600 text-xs dark:bg-neutral-900 dark:text-neutral-400"
                                {...props}
                            >
                                {category.label}
                            </div>
                        ),
                        Row: ({ children, ...props }) => (
                            <div className="scroll-my-1.5 px-1.5" {...props}>
                                {children}
                            </div>
                        ),
                        Emoji: ({ emoji, ...props }) => (
                            <button
                                className="flex size-8 items-center justify-center rounded-md text-lg data-[active]:bg-neutral-100 dark:data-[active]:bg-neutral-800"
                                {...props}
                            >
                                {emoji.emoji}
                            </button>
                        ),
                    }}
                />
            </FrimoussePicker.Viewport>
        </FrimoussePicker.Root>
    );
}
