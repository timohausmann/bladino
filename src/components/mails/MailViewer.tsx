import { ContentPanelHeader } from '@/components/layout/ContentPanelHeader';
import { ConfirmDialog } from '@/components/ui/alert-dialog/ConfirmDialog';
import { IconButton } from '@/components/ui/IconButton';
import { ResourceError } from '@/components/ui/ResourceError';
import { ResourceNotFound } from '@/components/ui/ResourceNotFound';
import { toast } from '@/components/ui/toast';
import {
  DeleteMailDocument,
  getGraphQLErrorMessage,
  MailDocument,
  useGraphQLMutation,
  useGraphQLQuery,
} from '@/graphql';
import { formatCommentDate } from '@/utils/formatDate';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MailViewerProps {
  mailId: string;
  headerLeading?: ReactNode;
  onDeleted?: (deletedId: string) => void;
}

function formatAddressList(
  addresses?: Array<string | null> | null,
): string | null {
  const filtered = addresses?.filter((address): address is string =>
    Boolean(address?.trim()),
  );
  return filtered && filtered.length > 0 ? filtered.join(', ') : null;
}

export function MailViewer({
  mailId,
  headerLeading,
  onDeleted,
}: MailViewerProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteMail = useGraphQLMutation(DeleteMailDocument);
  const { data, isLoading, isError } = useGraphQLQuery(MailDocument, {
    id: mailId,
  });
  const mail = data?.mail;

  const handleDeleteConfirm = async () => {
    try {
      const result = await deleteMail.mutateAsync({ id: mailId });
      if (!result.deleteMail) {
        toast(t('errors:deleteFailed'));
        return;
      }

      // Refetch inactive folders too. Auto-select reads their cache before they remount.
      await queryClient.invalidateQueries({
        queryKey: ['Mails'],
        refetchType: 'all',
      });
      onDeleted?.(mailId);
      toast(t('mail:deletedToast'));
    } catch (error) {
      const message =
        getGraphQLErrorMessage(error) ??
        (error instanceof Error ? error.message : t('errors:deleteFailed'));
      toast(message);
    }
  };

  const mailSubject = (subject?: string | null): string => {
    const trimmed = subject?.trim();
    return trimmed ? trimmed : t('mail:noSubject');
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
        {t('mail:loading')}
      </div>
    );
  }

  if (isError) {
    return (
      <ResourceError
        resource="mail"
        className="flex flex-1 flex-col items-center justify-center"
      />
    );
  }

  if (!mail) {
    return (
      <ResourceNotFound
        resource="mail"
        className="flex flex-1 flex-col items-center justify-center"
      />
    );
  }

  const to = formatAddressList(mail.to);
  const cc = formatAddressList(mail.cc);
  const bcc = formatAddressList(mail.bcc);
  const date = formatCommentDate(mail.dateReceived ?? mail.dateSent);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="shrink-0">
        <ContentPanelHeader
          title={mailSubject(mail.subject)}
          leading={headerLeading}
        >
          <div className="ml-auto shrink-0">
            <IconButton
              icon={<Trash2 size={18} />}
              label={t('mail:delete')}
              variant="dangerous"
              onClick={() => setDeleteOpen(true)}
              disabled={deleteMail.isPending}
            />
          </div>
        </ContentPanelHeader>
        <dl className="space-y-1 px-6 pb-4 text-sm text-neutral-600 dark:text-neutral-400">
          {mail.from && (
            <div className="flex gap-2">
              <dt className="w-12 shrink-0 text-neutral-500 dark:text-neutral-500">
                {t('mail:from')}
              </dt>
              <dd className="min-w-0 wrap-break-word">{mail.from}</dd>
            </div>
          )}
          {to && (
            <div className="flex gap-2">
              <dt className="w-12 shrink-0 text-neutral-500 dark:text-neutral-500">
                {t('mail:to')}
              </dt>
              <dd className="min-w-0 wrap-break-word">{to}</dd>
            </div>
          )}
          {cc && (
            <div className="flex gap-2">
              <dt className="w-12 shrink-0 text-neutral-500 dark:text-neutral-500">
                {t('mail:cc')}
              </dt>
              <dd className="min-w-0 wrap-break-word">{cc}</dd>
            </div>
          )}
          {bcc && (
            <div className="flex gap-2">
              <dt className="w-12 shrink-0 text-neutral-500 dark:text-neutral-500">
                {t('mail:bcc')}
              </dt>
              <dd className="min-w-0 wrap-break-word">{bcc}</dd>
            </div>
          )}
          {date && (
            <div className="flex gap-2">
              <dt className="w-12 shrink-0 text-neutral-500 dark:text-neutral-500">
                {t('mail:date')}
              </dt>
              <dd>{date}</dd>
            </div>
          )}
        </dl>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        {mail.body?.trim() ? (
          <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
            {mail.body}
          </pre>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t('mail:emptyBody')}
          </p>
        )}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('mail:deleteTitle')}
        description={t('mail:deleteDescription')}
        confirmLabel={t('common:delete')}
        destructive
        onConfirm={() => void handleDeleteConfirm()}
      />
    </div>
  );
}
