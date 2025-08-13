import { useState } from 'react';

interface CreateLinkProps {
    content: string;
    onContentChange: (content: string) => void;
    maxLength?: number;
}

/**
 * CreateLink component - handles link input for posts
 */
export function CreateLink({ content, onContentChange, maxLength = 280 }: CreateLinkProps) {
    const [linkUrl, setLinkUrl] = useState('');

    return (
        <div className="w-full min-h-[120px] space-y-3">
            <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-3 bg-black/5 dark:bg-black/10 border-none rounded-lg outline-none placeholder:text-muted-foreground"
            />
            <textarea
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                placeholder="Comment (optional)"
                className="w-full min-h-[120px] p-4 bg-black/5 dark:bg-black/10 rounded-lg border-none resize-none outline-none placeholder:text-muted-foreground"
                maxLength={maxLength}
            />

        </div>
    );
}
