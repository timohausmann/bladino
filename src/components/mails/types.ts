export type MailFolder = 'inbox' | 'outbox';

export const MAIL_FOLDERS: { value: MailFolder; label: string }[] = [
  { value: 'inbox', label: 'Inbox' },
  { value: 'outbox', label: 'Outbox' },
];
