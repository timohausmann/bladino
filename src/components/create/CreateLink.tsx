import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface CreateLinkProps {
  content: string;
  onContentChange: (content: string) => void;
  maxLength?: number;
}

export function CreateLink({
  content,
  onContentChange,
  maxLength = 280,
}: CreateLinkProps) {
  const { t } = useTranslation();
  const [linkUrl, setLinkUrl] = useState('');

  return (
    <div className="min-h-[120px] w-full space-y-3">
      <Input
        type="url"
        value={linkUrl}
        onChange={setLinkUrl}
        placeholder={t('posts:linkUrlPlaceholder')}
      />
      <Textarea
        value={content}
        onChange={onContentChange}
        placeholder={t('posts:linkCommentPlaceholder')}
        maxLength={maxLength}
      />
    </div>
  );
}
