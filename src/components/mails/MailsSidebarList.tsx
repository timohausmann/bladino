import type { MailFolder } from '@/components/mails/types';
import { List, ListItem } from '@/components/ui/list';
import { formatCommentDate } from '@/utils/formatDate';

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

function mailListTitle(subject?: string | null): string {
  const trimmed = subject?.trim();
  return trimmed ? trimmed : '(No subject)';
}

function mailListMeta(mail: MailsSidebarListMail, folder: MailFolder): string {
  const counterpart =
    folder === 'inbox'
      ? mail.from?.trim() || 'Unknown sender'
      : mail.to?.filter(Boolean).join(', ') || 'Unknown recipient';
  const date = formatCommentDate(
    folder === 'inbox' ? mail.dateReceived : mail.dateSent,
  );
  return date ? `${counterpart} · ${date}` : counterpart;
}

export function MailsSidebarList({
  mails,
  folder,
  selectedId,
  isLoading = false,
  onSelect,
}: MailsSidebarListProps) {
  if (isLoading) {
    return (
      <div className="p-4 text-sm text-neutral-500 dark:text-neutral-400">
        Loading mails…
      </div>
    );
  }

  if (mails.length === 0) {
    return (
      <div className="p-4 text-sm text-neutral-500 dark:text-neutral-400">
        No mails in this folder.
      </div>
    );
  }

  return (
    <List label="Mails">
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
