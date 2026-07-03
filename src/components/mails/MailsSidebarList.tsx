import type { MailFolder } from '@/components/mails/types';
import { List, ListItem } from '@/components/ui/list';
import { formatCommentDate } from '@/utils/formatDate';
import { useTranslation } from 'react-i18next';

interface MailsSidebarListMail {
  id: string;
  subject?: string | null;
  from?: string | null;
  to?: Array<string | null> | null;
  dateReceived?: string | null;
  dateSent?: string | null;
  unread?: boolean | null;
}

interface MailsSidebarListProps {
  mails: MailsSidebarListMail[];
  folder: MailFolder;
  selectedId: string | null;
  isLoading?: boolean;
  onSelect: (mailId: string) => void;
}

export function MailsSidebarList({
  mails,
  folder,
  selectedId,
  isLoading = false,
  onSelect,
}: MailsSidebarListProps) {
  const { t } = useTranslation();

  const mailListTitle = (subject?: string | null): string => {
    const trimmed = subject?.trim();
    return trimmed ? trimmed : t('mail:noSubject');
  };

  const mailListMeta = (
    mail: MailsSidebarListMail,
    mailFolder: MailFolder,
  ): string => {
    const counterpart =
      mailFolder === 'inbox'
        ? mail.from?.trim() || t('mail:unknownSender')
        : mail.to?.filter(Boolean).join(', ') || t('mail:unknownRecipient');
    const date = formatCommentDate(
      mailFolder === 'inbox' ? mail.dateReceived : mail.dateSent,
    );
    return date ? `${counterpart} · ${date}` : counterpart;
  };

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-neutral-500 dark:text-neutral-400">
        {t('mail:loadingList')}
      </div>
    );
  }

  if (mails.length === 0) {
    return (
      <div className="p-4 text-sm text-neutral-500 dark:text-neutral-400">
        {t('mail:emptyFolder')}
      </div>
    );
  }

  return (
    <List label={t('mail:listLabel')}>
      {mails.map((mail) => (
        <ListItem
          key={mail.id}
          title={mailListTitle(mail.subject)}
          meta={mailListMeta(mail, folder)}
          active={selectedId === mail.id}
          className={mail.unread ? 'font-semibold' : undefined}
          onClick={() => onSelect(mail.id)}
        />
      ))}
    </List>
  );
}
