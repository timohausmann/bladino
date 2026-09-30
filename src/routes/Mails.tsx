import {
  MailComposer,
  MailViewer,
  MailsEmptyState,
  MailsSidebarList,
  MailsSidebarToolbar,
  type MailFolder,
  useMailComposer,
} from '@/components/mails';
import { ContentFrame } from '@/components/layout/ContentFrame';
import { MobileBackLink } from '@/components/layout/MobileBackLink';
import { ConfirmDialog } from '@/components/ui/alert-dialog/ConfirmDialog';
import { toast } from '@/components/ui/toast';
import {
  DeleteAllMailDocument,
  getGraphQLErrorMessage,
  MailsDocument,
  useGraphQLMutation,
  useGraphQLQuery,
  type MailsQuery,
} from '@/graphql';
import { useDesktopLayout } from '@/hooks/useDesktopLayout';
import { useQueryClient } from '@tanstack/react-query';
import {
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function mailsFromQuery(data?: MailsQuery) {
  return (data?.mails ?? []).filter(
    (mail): mail is NonNullable<typeof mail> => mail != null,
  );
}

/** Id from `/mails/$id`. Null on the list or composer. */
function mailIdFromPathname(pathname: string): string | null {
  const prefix = '/mails/';
  if (!pathname.startsWith(prefix)) {
    return null;
  }

  const id = pathname.slice(prefix.length);
  return id && !id.includes('/') ? decodeURIComponent(id) : null;
}

/** Next mail below the deleted one, else above. Null when that id is not in `mails`. */
function getNextMailIdAfterDelete(
  mails: { id: string }[],
  deletedId: string,
): string | null {
  const index = mails.findIndex((mail) => mail.id === deletedId);
  if (index === -1) {
    return null;
  }

  const next = mails[index + 1] ?? mails[index - 1];
  return next?.id ?? null;
}

/**
 * Hand-off between the /mails and /mails/$id routes. Each route mounts its own
 * Mails instance, so a ref set before navigate() is gone on the next screen.
 */
let pendingDeletedMailId: string | null = null;
let pendingClearAllMailDetails = false;

/**
 * Mails page with context panel list, read-only viewer, and compose mode.
 */
export function Mails() {
  const { t } = useTranslation();
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const router = useRouter();
  const isDesktopLayout = useDesktopLayout();
  const search = useSearch({ strict: false });
  const folder: MailFolder = search.folder === 'outbox' ? 'outbox' : 'inbox';
  const isComposing = search.compose === true;

  const queryClient = useQueryClient();
  const composer = useMailComposer();
  const deleteAllMail = useGraphQLMutation(DeleteAllMailDocument);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const { data, isLoading, isFetching, refetch } = useGraphQLQuery(
    MailsDocument,
    { folder },
  );
  const mails = mailsFromQuery(data);
  const selectedId = isComposing ? null : (id ?? null);

  useEffect(() => {
    const deletedId = pendingDeletedMailId;
    // Still showing this mail. removeQueries would refetch it while the viewer is mounted.
    if (deletedId && deletedId !== selectedId) {
      pendingDeletedMailId = null;
      queryClient.removeQueries({
        queryKey: ['Mail', { id: deletedId }],
        exact: true,
      });
    }

    // Same for delete-all: the open viewer would refetch every detail query.
    if (pendingClearAllMailDetails && !selectedId) {
      pendingClearAllMailDetails = false;
      queryClient.removeQueries({ queryKey: ['Mail'] });
    }
  }, [queryClient, selectedId]);

  useEffect(() => {
    if (!isDesktopLayout || isComposing || id) {
      return;
    }

    // Router updates render before React Query notifies this hook.
    // The cache already has the post-delete list; `mails` in this render may not.
    const fresh = mailsFromQuery(
      queryClient.getQueryData<MailsQuery>(['Mails', { folder }]),
    );
    const firstId = fresh[0]?.id;
    if (!firstId) {
      return;
    }

    navigate({
      to: '/mails/$id',
      params: { id: firstId },
      search: { folder },
      replace: true,
    });
  }, [id, isComposing, isDesktopLayout, mails, navigate, folder, queryClient]);

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

  const handleMailDeleted = (deletedId: string) => {
    // This callback still sees the folder from the click. If the user
    // opened another mail, a folder, or the composer, stay there.
    const stillOpen =
      mailIdFromPathname(router.state.location.pathname) === deletedId;
    if (!stillOpen) {
      queryClient.removeQueries({
        queryKey: ['Mail', { id: deletedId }],
        exact: true,
      });
      return;
    }

    pendingDeletedMailId = deletedId;
    const nextId = getNextMailIdAfterDelete(mails, deletedId);
    // Replace the deleted mail so Back doesn't reopen it.
    if (nextId) {
      navigate({
        to: '/mails/$id',
        params: { id: nextId },
        search: { folder },
        replace: true,
      });
      return;
    }

    navigate({ to: '/mails', search: { folder }, replace: true });
  };

  const handleDeleteAllConfirm = async () => {
    const hrefAtConfirm = router.state.location.href;

    try {
      const result = await deleteAllMail.mutateAsync({});
      if (!result.deleteAllMail) {
        toast(t('errors:deleteFailed'));
        return;
      }

      // Refetch inactive folders too. Auto-select reads their cache before they remount.
      await queryClient.invalidateQueries({
        queryKey: ['Mails'],
        refetchType: 'all',
      });
      toast(t('mail:deletedAllToast'));

      // Same rule: don't pull the user back to the screen they already left.
      if (router.state.location.href !== hrefAtConfirm) {
        queryClient.removeQueries({ queryKey: ['Mail'] });
        return;
      }

      if (selectedId) {
        pendingClearAllMailDetails = true;
      } else {
        queryClient.removeQueries({ queryKey: ['Mail'] });
      }

      if (!isComposing) {
        navigate({ to: '/mails', search: { folder }, replace: true });
      }
    } catch (error) {
      const message =
        getGraphQLErrorMessage(error) ??
        (error instanceof Error ? error.message : t('errors:deleteFailed'));
      toast(message);
    }
  };

  return (
    <>
      <ContentFrame
        mobilePane={isComposing || selectedId ? 'content' : 'sidebar'}
        sidebar={
          <>
            <MailsSidebarToolbar
              onCompose={handleCompose}
              folder={folder}
              onFolderChange={handleFolderChange}
              onReload={handleReload}
              onDeleteAll={() => setDeleteAllOpen(true)}
              isDeleteAllPending={deleteAllMail.isPending}
              isReloading={isFetching && !isLoading}
              isSending={composer.isSending}
            />
            <MailsSidebarList
              mails={mails}
              folder={folder}
              selectedId={selectedId}
              isLoading={isLoading}
              onSelect={handleSelect}
            />
          </>
        }
      >
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
          <MailViewer
            mailId={selectedId}
            onDeleted={handleMailDeleted}
            headerLeading={
              <MobileBackLink
                to="/mails"
                search={{ folder }}
                label={t('common:back')}
              />
            }
          />
        ) : (
          <MailsEmptyState />
        )}
      </ContentFrame>

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

      <ConfirmDialog
        open={deleteAllOpen}
        onOpenChange={setDeleteAllOpen}
        title={t('mail:deleteAllTitle')}
        description={t('mail:deleteAllDescription')}
        confirmLabel={t('common:delete')}
        destructive
        onConfirm={() => void handleDeleteAllConfirm()}
      />
    </>
  );
}
