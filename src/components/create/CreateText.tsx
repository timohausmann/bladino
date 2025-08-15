
import { Textarea } from '../form';

interface CreateTextProps {
    content: string;
    onContentChange: (content: string) => void;
    maxLength?: number;
}

export function CreateText({ content, onContentChange, maxLength = 280 }: CreateTextProps) {
    return (
        <Textarea
            value={content}
            onChange={onContentChange}
            placeholder="What's happening?"
            maxLength={maxLength}
        />
    );
}
