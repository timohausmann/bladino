import { ResourceError } from '@/components/ui/ResourceError';
import { ResourceNotFound } from '@/components/ui/ResourceNotFound';
import { MailDocument, useGraphQLQuery } from '@/graphql';
import { formatCommentDate } from '@/utils/formatDate';

interface MailViewerProps {
  mailId: string;
}

function formatAddressList(
  addresses?: Array<string | null> | null,
): string | null {
  const filtered = addresses?.filter((address): address is string =>
    Boolean(address?.trim()),
  );
  return filtered && filtered.length > 0 ? filtered.join(', ') : null;
}

function mailSubject(subject?: string | null): string {
  const trimmed = subject?.trim();
  return trimmed ? trimmed : '(No subject)';
}

export function MailViewer({ mailId }: MailViewerProps) {
  const { data, isLoading, isError } = useGraphQLQuery(MailDocument, {
    id: mailId,
  });
  const mail = data?.mail;

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
        Loading mail…
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
      <header className="shrink-0 border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {mailSubject(mail.subject)}
        </h1>
        <dl className="mt-3 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
          {mail.from && (
            <div className="flex gap-2">
              <dt className="w-12 shrink-0 text-neutral-500 dark:text-neutral-500">
                From
              </dt>
              <dd className="min-w-0 wrap-break-word">{mail.from}</dd>
            </div>
          )}
          {to && (
            <div className="flex gap-2">
              <dt className="w-12 shrink-0 text-neutral-500 dark:text-neutral-500">
                To
              </dt>
              <dd className="min-w-0 wrap-break-word">{to}</dd>
            </div>
          )}
          {cc && (
            <div className="flex gap-2">
              <dt className="w-12 shrink-0 text-neutral-500 dark:text-neutral-500">
                Cc
              </dt>
              <dd className="min-w-0 wrap-break-word">{cc}</dd>
            </div>
          )}
          {bcc && (
            <div className="flex gap-2">
              <dt className="w-12 shrink-0 text-neutral-500 dark:text-neutral-500">
                Bcc
              </dt>
              <dd className="min-w-0 wrap-break-word">{bcc}</dd>
            </div>
          )}
          {date && (
            <div className="flex gap-2">
              <dt className="w-12 shrink-0 text-neutral-500 dark:text-neutral-500">
                Date
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
            This mail has no body.
          </p>
        )}
      </div>
    </div>
  );
}
