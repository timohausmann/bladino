import { Textarea } from '@/components/ui/Textarea';
import { useTranslation } from 'react-i18next';

interface CreateTextProps {
  content: string;
  onContentChange: (content: string) => void;
  maxLength?: number;
}

export function CreateText({
  content,
  onContentChange,
  maxLength = 280,
}: CreateTextProps) {
  const { t } = useTranslation();

  return (
    <Textarea
      value={content}
      onChange={onContentChange}
      placeholder={t('posts:composerPlaceholder')}
      maxLength={maxLength}
    />
  );
}
