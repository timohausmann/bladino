
interface CreateTextProps {
    content: string;
    onContentChange: (content: string) => void;
    maxLength?: number;
}

/**
 * CreateText component - handles text input for posts
 */
export function CreateText({ content, onContentChange, maxLength = 280 }: CreateTextProps) {
    return (
        <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="What's happening?"
            className="w-full min-h-[120px] p-4 bg-black/5 dark:bg-black/10 rounded-lg border-none resize-none outline-none placeholder:text-muted-foreground"
            maxLength={maxLength}
        />
    );
}
