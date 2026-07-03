import {
  MailComposer,
  MailViewer,
  MailsEmptyState,
  MailsSidebarList,
  MailsSidebarToolbar,
  type MailFolder,
  useMailComposer,
} from '@/components/mails';
import { ContextPanel } from '@/components/layout/ContextPanel';
import { ConfirmDialog } from '@/components/ui/alert-dialog/ConfirmDialog';
import { MailsDocument, useGraphQLQuery } from '@/graphql';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Mails page with context panel list, read-only viewer, and compose mode.
 */
export function Mails() {
  const { t } = useTranslation();
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const folder: MailFolder = search.folder === 'outbox' ? 'outbox' : 'inbox';
  const isComposing = search.compose === true;

  const composer = useMailComposer();
  const [discardOpen, setDiscardOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const { data, isLoading, isFetching, refetch } = useGraphQLQuery(
    MailsDocument,
    { folder },
  );
  const mails = (data?.mails ?? []).filter(
    (mail): mail is NonNullable<typeof mail> => mail != null,
  );
  const selectedId = isComposing ? null : (id ?? null);

  useEffect(() => {
    if (isComposing || id) {
      return;
    }

    if (mails.length > 0) {
      navigate({
        to: '/mails/$id',
        params: { id: mails[0].id },
        search: { folder },
        replace: true,
      });
    }
  }, [id, isComposing, mails, navigate, folder]);

  const runOrConfirmDiscard = (action: () => void) => {
    if (isComposing && composer.isDirty) {
      setPendingAction(() => action);
      setDiscardOpen(true);
      return;
    }

    action();
  };

  const handleSelect = (mailId: string) => {
    runOrConfirmDiscard(() => {
      navigate({
        to: '/mails/$id',
        params: { id: mailId },
        search: { folder },
      });
    });
  };

  const handleFolderChange = (nextFolder: MailFolder) => {
    runOrConfirmDiscard(() => {
      navigate({
        to: '/mails',
        search: { folder: nextFolder },
      });
    });
  };

  const handleCompose = () => {
    composer.reset();
    navigate({
      to: '/mails',
      search: { folder: 'outbox', compose: true },
    });
  };

  const handleCancelCompose = () => {
    runOrConfirmDiscard(() => {
      composer.reset();
      navigate({
        to: '/mails',
        search: { folder },
      });
    });
  };

  const handleSend = async () => {
    const sent = await composer.handleSend();
    if (!sent) {
      return;
    }

    navigate({
      to: '/mails',
      search: { folder: 'outbox' },
    });
    void refetch();
  };

  const handleDiscardConfirm = () => {
    composer.reset();
    pendingAction?.();
    setPendingAction(null);
    setDiscardOpen(false);
  };

  const handleReload = () => {
    void refetch();
  };

  return (
    <div className="flex h-full min-h-0 flex-1">
      <ContextPanel
        header={
          <MailsSidebarToolbar
            onCompose={handleCompose}
            folder={folder}
            onFolderChange={handleFolderChange}
            onReload={handleReload}
            isReloading={isFetching && !isLoading}
            isSending={composer.isSending}
          />
        }
      >
        <MailsSidebarList
          mails={mails}
          folder={folder}
          selectedId={selectedId}
          isLoading={isLoading}
          onSelect={handleSelect}
        />
      </ContextPanel>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {isComposing ? (
          <MailComposer
            to={composer.to}
            onToChange={composer.setTo}
            cc={composer.cc}
            onCcChange={composer.setCc}
            bcc={composer.bcc}
            onBccChange={composer.setBcc}
            subject={composer.subject}
            onSubjectChange={composer.setSubject}
            body={composer.body}
            onBodyChange={composer.setBody}
            canSend={composer.canSend}
            isSending={composer.isSending}
            onCancel={handleCancelCompose}
            onSend={() => void handleSend()}
          />
        ) : selectedId ? (
          <MailViewer mailId={selectedId} />
        ) : (
          <MailsEmptyState />
        )}
      </div>

      <ConfirmDialog
        open={discardOpen}
        onOpenChange={(open) => {
          setDiscardOpen(open);
          if (!open) {
            setPendingAction(null);
          }
        }}
        title={t('mail:discardDraftTitle')}
        description={t('mail:discardDraftDescription')}
        confirmLabel={t('common:discard')}
        destructive
        onConfirm={handleDiscardConfirm}
      />
    </div>
  );
}
