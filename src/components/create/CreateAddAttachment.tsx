import { Paperclip } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type {
  HeaderButtonShape,
  HeaderButtonVariant,
} from '@/components/ui/headerButtonVariants';
import { HeaderButton } from '@/components/ui/HeaderButton';

interface CreateAddAttachmentProps {
  onAddFiles?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: HeaderButtonVariant;
  shape?: HeaderButtonShape;
}

export function CreateAddAttachment({
  onAddFiles,
  className,
  disabled,
  variant = 'default',
  shape = 'round',
}: CreateAddAttachmentProps) {
  const { t } = useTranslation();

  return (
    <HeaderButton
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
