import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Smile } from 'react-feather';
import { PostActionButton } from './PostActionButton';

// Define the props for the EmojiReaction component
interface EmojiReactionProps {
    reactions: { [key: string]: number; };
    onReaction: (emoji: string) => void;
}

/**
 * EmojiReaction - A component for adding emoji reactions to posts
 * Uses emoji-mart under the hood for the emoji picker
 * Shows the top 5 emoji reactions with their counts
 */
export function EmojiReaction({ reactions, onReaction }: EmojiReactionProps) {
    const [pickerVisible, setPickerVisible] = useState(false);
    const [quickPickerVisible, setQuickPickerVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [emojiMartPicker, setEmojiMartPicker] = useState<any>(null);

    // Popular emoji quick reactions
    const popularEmojis = ['👍', '❤️', '😂', '🔥', '👏', '🎉'];

    // Get the top 5 emoji reactions
    const topReactions = useMemo(() => {
        return Object.entries(reactions)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 4);
    }, [reactions]);

    // Handle showing the quick reaction picker
    const handleShowQuickPicker = () => {
        setQuickPickerVisible(true);
        setPickerVisible(false);
    };

    // Handle showing the full emoji picker
    const handleShowFullPicker = () => {
        setPickerVisible(true);
        setQuickPickerVisible(false);
    };

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleShowQuickPicker();
        }
        if (event.key === 'Escape') {
            setQuickPickerVisible(false);
            setPickerVisible(false);
        }
    };

    // Load emoji-mart dynamically to avoid SSR issues
    useEffect(() => {
        let isMounted = true;

        const loadEmojiMart = async () => {
            if (pickerVisible && !emojiMartPicker) {
                try {
                    // Dynamic imports to avoid SSR issues
                    const dataModule = await import('@emoji-mart/data');
                    const emojiMartReact = await import('@emoji-mart/react');

                    if (isMounted) {
                        // Use the default export from @emoji-mart/react
                        const EmojiPickerComponent = emojiMartReact.default;

                        setEmojiMartPicker(
                            <EmojiPickerComponent
                                data={dataModule.default}
                                onEmojiSelect={(emoji: any) => {
                                    onReaction(emoji.native);
                                    setPickerVisible(false);
                                }}
                                autoFocus={true}
                                set="native"
                                theme="light"
                                skinTonePosition="none"
                                previewPosition="none"
                                maxFrequentRows={0}
                            />
                        );
                    }
                } catch (error) {
                    console.error('Error loading emoji-mart:', error);
                }
            }
        };

        loadEmojiMart();

        return () => {
            isMounted = false;
        };
    }, [pickerVisible, emojiMartPicker, onReaction]);

    // Handle clicking outside to close pickers
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setPickerVisible(false);
                setQuickPickerVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            {/* Top reactions display */}
            <div className="flex items-center flex-wrap gap-2">
                {/* Reaction bubbles with counts */}
                {topReactions.length > 0 ? (
                    <>
                        {topReactions.map(([emoji, count]) => (
                            <PostActionButton
                                key={emoji}
                                icon={<span className="text-sm">{emoji}</span>}
                                count={count}
                                label={`React with ${emoji}`}
                                onClick={() => onReaction(emoji)}
                                className="h-10 px-3"
                            />
                        ))}
                    </>
                ) : (
                    <button
                        className="flex items-center justify-center w-10 h-10 bg-black/5 rounded-full transition-all dark:bg-black/10 dark:hover:bg-black/20 duration-200 hover:bg-black/10 hover:shadow-md cursor-pointer"
                        onClick={handleShowQuickPicker}
                        onKeyDown={handleKeyDown}
                        aria-label="Add a reaction"
                        title="Add a reaction"
                        tabIndex={0}
                    >
                        <Smile size={18} />
                    </button>
                )}

                {/* Add reaction button */}
                <button
                    className="flex items-center justify-center w-10 h-10 bg-black/5 rounded-full transition-all duration-200 dark:bg-black/10 dark:hover:bg-black/20 hover:bg-black/10 hover:shadow-md"
                    onClick={handleShowQuickPicker}
                    onKeyDown={handleKeyDown}
                    aria-label="Add a reaction"
                    title="Add a reaction"
                    aria-expanded={quickPickerVisible || pickerVisible}
                    aria-haspopup="true"
                    tabIndex={0}
                >
                    <span className="text-sm font-bold">+</span>
                </button>
            </div>

            {/* Quick reaction picker */}
            {quickPickerVisible && (
                <div
                    className="absolute z-10 bottom-full left-0 mb-2 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                    role="menu"
                    aria-label="Quick emoji reactions"
                >
                    <div className="flex gap-2">
                        {popularEmojis.map((emoji) => (
                            <button
                                key={emoji}
                                className="w-10 h-10 flex items-center justify-center text-lg bg-black/10 rounded-full transition-all duration-200 hover:bg-black/20 hover:shadow-md"
                                onClick={() => {
                                    onReaction(emoji);
                                    setQuickPickerVisible(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onReaction(emoji);
                                        setQuickPickerVisible(false);
                                    }
                                }}
                                aria-label={`React with ${emoji}`}
                                role="menuitem"
                                tabIndex={0}
                            >
                                {emoji}
                            </button>
                        ))}
                        <button
                            className="w-10 h-10 flex items-center justify-center text-gray-500 bg-black/10 rounded-full transition-all duration-200 hover:bg-black/20 hover:shadow-md"
                            onClick={handleShowFullPicker}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleShowFullPicker();
                                }
                            }}
                            aria-label="More emojis"
                            title="More emojis"
                            role="menuitem"
                            tabIndex={0}
                        >
                            <span>···</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Full emoji picker */}
            {pickerVisible && (
                <div
                    className="absolute z-10 bottom-full left-0 mb-2 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                    role="dialog"
                    aria-label="Emoji picker"
                >
                    {emojiMartPicker}
                </div>
            )}
        </div>
    );
} 