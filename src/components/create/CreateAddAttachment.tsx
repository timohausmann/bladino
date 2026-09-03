import { Paperclip } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  type IconButtonShape,
  type IconButtonVariant,
} from '@/components/ui/IconButton';

interface CreateAddAttachmentProps {
  onAddFiles?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: IconButtonVariant;
  shape?: IconButtonShape;
}

export function CreateAddAttachment({
  onAddFiles,
  className,
  disabled,
  variant = 'default',
  shape = 'circle',
}: CreateAddAttachmentProps) {
  const { t } = useTranslation();

  return (
    <IconButton
      type="button"
      icon={<Paperclip size={20} />}
      label={t('posts:addPhotosOrFiles')}
      variant={variant}
      shape={shape}
      className={className}
      disabled={disabled}
      onClick={onAddFiles}
    />
  );
}
