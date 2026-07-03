import { Button } from '@/components/ui/button';
import * as Toolbar from '@radix-ui/react-toolbar';

interface MailComposerToolbarProps {
  onCancel: () => void;
  onSend: () => void;
  canSend?: boolean;
  isSending?: boolean;
}

export function MailComposerToolbar({
  onCancel,
  onSend,
  canSend = false,
  isSending = false,
}: MailComposerToolbarProps) {
  return (
    <Toolbar.Root
      className="flex shrink-0 items-center gap-4 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800"
      aria-label="Compose mail actions"
    >
      <Toolbar.Button asChild>
        <Button
          type="button"
          variant="secondary"
          appearance="outline"
          effect="none"
          className="px-4 py-1.5 text-sm"
          onClick={onCancel}
          disabled={isSending}
        >
          Cancel
        </Button>
      </Toolbar.Button>
      <Toolbar.Button asChild className="ml-auto">
        <Button
          type="button"
          variant="primary"
          effect="none"
          className="px-4 py-1.5 text-sm"
          onClick={onSend}
          loading={isSending}
          disabled={!canSend || isSending}
        >
          Send
        </Button>
      </Toolbar.Button>
    </Toolbar.Root>
  );
}
