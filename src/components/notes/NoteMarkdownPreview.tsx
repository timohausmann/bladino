import Markdown from 'marked-react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

const markdownClassName = twMerge(
  'text-base leading-relaxed text-neutral-800 dark:text-neutral-200',
  '[&_h1]:mt-6 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1:first-child]:mt-0',
  '[&_h2]:mt-5 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold',
  '[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold',
  '[&_p]:mb-4 [&_p:last-child]:mb-0',
  '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6',
  '[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6',
  '[&_li]:mb-1',
  '[&_a]:text-cyan-600 [&_a]:underline dark:[&_a]:text-cyan-400',
  '[&_code]:rounded [&_code]:bg-neutral-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm dark:[&_code]:bg-neutral-800',
  '[&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-neutral-100 [&_pre]:p-4 dark:[&_pre]:bg-neutral-900',
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
  '[&_blockquote]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-4 [&_blockquote]:text-neutral-600 dark:[&_blockquote]:border-neutral-600 dark:[&_blockquote]:text-neutral-400',
  '[&_hr]:my-6 [&_hr]:border-neutral-200 dark:[&_hr]:border-neutral-700',
  '[&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse',
  '[&_th]:border [&_th]:border-neutral-200 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold dark:[&_th]:border-neutral-700',
  '[&_td]:border [&_td]:border-neutral-200 [&_td]:px-3 [&_td]:py-2 dark:[&_td]:border-neutral-700',
);

interface NoteMarkdownPreviewProps {
  body: string;
  className?: string;
}

export function NoteMarkdownPreview({
  body,
  className,
}: NoteMarkdownPreviewProps) {
  const { t } = useTranslation();

  if (!body.trim()) {
    return (
      <p className="text-sm text-neutral-400 dark:text-neutral-500">
        {t('notes:previewEmpty')}
      </p>
    );
  }

  return (
    <div className={twMerge(markdownClassName, className)}>
      <Markdown value={body} gfm openLinksInNewTab />
    </div>
  );
}
