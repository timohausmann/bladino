import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface CreateLinkProps {
    content: string;
    onContentChange: (content: string) => void;
    maxLength?: number;
}

export function CreateLink({ content, onContentChange, maxLength = 280 }: CreateLinkProps) {
    const [linkUrl, setLinkUrl] = useState('');

    return (
        <div className="w-full min-h-[120px] space-y-3">
            <Input
                type="url"
                value={linkUrl}
                onChange={setLinkUrl}
                placeholder="https://..."
            />
            <Textarea
                value={content}
                onChange={onContentChange}
                placeholder="Comment (optional)"
                maxLength={maxLength}
            />
        </div>
    );
}
