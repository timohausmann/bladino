import { MailComposerToolbar } from '@/components/mails/MailComposerToolbar';
import { Textarea } from '@/components/ui/Textarea';
import * as Collapsible from '@radix-ui/react-collapsible';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MailComposerProps {
  to: string;
  onToChange: (value: string) => void;
  cc: string;
  onCcChange: (value: string) => void;
  bcc: string;
  onBccChange: (value: string) => void;
  subject: string;
  onSubjectChange: (value: string) => void;
  body: string;
  onBodyChange: (value: string) => void;
  canSend?: boolean;
  isSending?: boolean;
  onCancel: () => void;
  onSend: () => void;
}

const composerInputClassName =
  'w-full border-none bg-transparent px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500';

function ComposerSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        'overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50/60 dark:border-neutral-800 dark:bg-neutral-900/40',
        className,
      )}
    >
      {children}
    </section>
  );
}

function ComposerInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  className,
  autoComplete,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  autoComplete?: string;
}) {
  return (
    <input
      id={id}
      name={name}
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      autoComplete={autoComplete}
      className={clsx(composerInputClassName, className)}
    />
  );
}

export function MailComposer({
  to,
  onToChange,
  cc,
  onCcChange,
  bcc,
  onBccChange,
  subject,
  onSubjectChange,
  body,
  onBodyChange,
  canSend = false,
  isSending = false,
  onCancel,
  onSend,
}: MailComposerProps) {
  const { t } = useTranslation();
  const [ccBccOpen, setCcBccOpen] = useState(false);
  const hasCcBcc = Boolean(cc.trim() || bcc.trim());

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MailComposerToolbar
        onCancel={onCancel}
        onSend={onSend}
        canSend={canSend}
        isSending={isSending}
      />

      <form
        className="flex min-h-0 flex-1 flex-col gap-1.5 p-4"
        aria-label={t('mail:composeLabel')}
        onSubmit={(event) => event.preventDefault()}
      >
        <ComposerSection>
          <Collapsible.Root open={ccBccOpen} onOpenChange={setCcBccOpen}>
            <div className="flex items-center gap-2 pr-2">
              <ComposerInput
                id="mail-to"
                name="to"
                value={to}
                onChange={onToChange}
                placeholder={t('mail:to')}
                autoComplete="email"
              />
              <Collapsible.Trigger asChild>
                <button
                  type="button"
                  className={clsx(
                    'flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                    ccBccOpen || hasCcBcc
                      ? 'text-cyan-700 hover:bg-cyan-500/10 dark:text-cyan-400 dark:hover:bg-cyan-500/15'
                      : 'text-neutral-500 hover:bg-black/5 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-neutral-200',
                  )}
                  aria-label={
                    ccBccOpen ? t('mail:hideCcBcc') : t('mail:showCcBcc')
                  }
                >
                  {t('mail:ccBccToggle')}
                  <ChevronDown
                    size={14}
                    className={clsx(
                      'transition-transform duration-200',
                      ccBccOpen && 'rotate-180',
                    )}
                    aria-hidden
                  />
                </button>
              </Collapsible.Trigger>
            </div>

            <Collapsible.Content
              className={clsx(
                'overflow-hidden border-t border-neutral-200 dark:border-neutral-800',
                'data-[state=open]:animate-[radixCollapsibleSlideDown_300ms_ease-out]',
                'data-[state=closed]:animate-[radixCollapsibleSlideUp_300ms_ease-out]',
                'will-change-[height]',
              )}
            >
              <ComposerInput
                id="mail-cc"
                name="cc"
                value={cc}
                onChange={onCcChange}
                placeholder={t('mail:cc')}
                autoComplete="email"
              />
              <ComposerInput
                id="mail-bcc"
                name="bcc"
                value={bcc}
                onChange={onBccChange}
                placeholder={t('mail:bcc')}
                autoComplete="email"
                className="border-t border-neutral-200 dark:border-neutral-800"
              />
            </Collapsible.Content>
          </Collapsible.Root>
        </ComposerSection>

        <ComposerSection>
          <ComposerInput
            id="mail-subject"
            name="subject"
            value={subject}
            onChange={onSubjectChange}
            placeholder={t('mail:subject')}
            autoComplete="off"
          />
        </ComposerSection>

        <ComposerSection className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col p-3">
            <Textarea
              id="mail-body"
              name="body"
              value={body}
              onChange={onBodyChange}
              placeholder={t('mail:bodyPlaceholder')}
              autoComplete="off"
              resize="resize-none"
              wrapperClassName="flex min-h-0 flex-1 flex-col"
              className="h-full min-h-0 flex-1 overflow-y-auto rounded-none border-none bg-transparent p-0 text-base leading-relaxed focus:bg-transparent dark:bg-transparent dark:focus:bg-transparent"
              rows={1}
            />
          </div>
        </ComposerSection>
      </form>
    </div>
  );
}
