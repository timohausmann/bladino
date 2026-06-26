import type {
  File as ApiFile,
  UpdateCommentMutationVariables,
} from '@/graphql';
import {
  AddCommentDocument,
  getGraphQLErrorMessage,
  UpdateCommentDocument,
  useGraphQLMutation,
} from '@/graphql';
import { toast } from '@/components/ui/toast';
import {
  type ComposerFile,
  fileToLocalDraft,
  filesUnchanged,
  isLocalDraftFile,
  MAX_COMMENT_FILES,
  resolveComposerFileIds,
  revokeBlobUrl,
  revokeDraftFiles,
  revokeLocalDrafts,
} from '@/utils/postFileUtils';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';

export interface UseCommentComposerOptions {
  mode: 'create' | 'edit';
  commentId?: string;
  channel?: string;
  parent?: string;
  initialContent?: string;
  initialFiles?: ApiFile[];
  onSuccess?: () => void;
  errorMessage?: string;
}

interface InitialSnapshot {
  content: string;
  trimmedBody: string;
  files: ComposerFile[];
}

function trimBody(body?: string | null): string {
  return body?.trim() ?? '';
}

const FILE_LIMIT_TOAST = `You can only attach up to ${MAX_COMMENT_FILES} files.`;

export function useCommentComposer({
  mode,
  commentId,
  channel,
  parent,
  initialContent = '',
  initialFiles = [],
  onSuccess,
  errorMessage = 'Failed to save',
}: UseCommentComposerOptions) {
  const [initial] = useState<InitialSnapshot>(() => ({
    content: initialContent,
    trimmedBody: trimBody(initialContent),
    files: [...initialFiles],
  }));

  const [content, setContent] = useState(initial.content);
  const [files, setFiles] = useState<ComposerFile[]>(initial.files);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { mutateAsync: addComment } = useGraphQLMutation(AddCommentDocument);
  const { mutateAsync: updateComment } = useGraphQLMutation(
    UpdateCommentDocument,
  );

  const trimmedBody = content.trim();
  const canSubmit =
    (trimmedBody.length > 0 || files.length > 0) && !isSubmitting;
  const uploadOptions = { channel, parent };

  const handleAddFilesClick = () => {
    if (files.length >= MAX_COMMENT_FILES) {
      toast(FILE_LIMIT_TOAST);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles?.length) return;

    const newFiles = Array.from(selectedFiles).map(fileToLocalDraft);
    const room = MAX_COMMENT_FILES - files.length;

    if (room <= 0) {
      toast(FILE_LIMIT_TOAST);
      revokeDraftFiles(newFiles);
      e.target.value = '';
      return;
    }

    const accepted = newFiles.slice(0, room);
    const rejected = newFiles.slice(room);

    if (rejected.length > 0) {
      toast(FILE_LIMIT_TOAST);
      revokeDraftFiles(rejected);
    }

    setFiles((prev) => [...prev, ...accepted]);
    e.target.value = '';
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => {
      const removed = prev.find((file) => file.id === fileId);
      if (removed && isLocalDraftFile(removed)) {
        revokeBlobUrl(removed.url);
      }
      return prev.filter((file) => file.id !== fileId);
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent((prev) => {
      if (!prev.length || prev.slice(-1) === ' ') {
        return prev + emoji;
      }
      return `${prev} ${emoji}`;
    });
  };

  const handleCancel = () => {
    revokeLocalDrafts(files);
    setContent(initial.content);
    setFiles(initial.files);
  };

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ['CommentFeed'] });
    if (commentId) {
      await queryClient.invalidateQueries({
        queryKey: ['Comment', { id: commentId }],
      });
    }
  };

  const submitCreate = async () => {
    const fileIds =
      files.length > 0
        ? await resolveComposerFileIds(files, uploadOptions)
        : [];

    await addComment({
      body: trimmedBody || undefined,
      channel,
      files: fileIds.length > 0 ? fileIds : undefined,
      parent,
    });

    revokeLocalDrafts(files);
    setContent('');
    setFiles([]);
  };

  const submitEdit = async () => {
    if (!commentId) {
      throw new Error('commentId is required for edit mode');
    }

    const bodyChanged = trimmedBody !== initial.trimmedBody;
    const filesChanged = !filesUnchanged(files, initial.files);

    if (!bodyChanged && !filesChanged) {
      return;
    }

    const variables: UpdateCommentMutationVariables = { id: commentId };

    if (bodyChanged) {
      variables.body = trimmedBody || undefined;
    }

    if (filesChanged) {
      variables.files = await resolveComposerFileIds(files, uploadOptions);
    }

    await updateComment(variables);
    revokeLocalDrafts(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        await submitCreate();
      } else {
        await submitEdit();
      }

      await invalidateQueries();
      onSuccess?.();
    } catch (error) {
      const message =
        getGraphQLErrorMessage(error) ??
        (error instanceof Error ? error.message : errorMessage);
      toast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    content,
    setContent,
    files,
    isSubmitting,
    canSubmit,
    fileInputRef,
    handleSubmit,
    handleAddFilesClick,
    handleFileChange,
    handleRemoveFile,
    handleEmojiSelect,
    handleCancel,
  };
}
