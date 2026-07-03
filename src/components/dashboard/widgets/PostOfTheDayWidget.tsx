import { CommentBody } from '@/components/post/CommentBody';
import { PostHeader } from '@/components/post/PostHeader';
import { Banner } from '@/components/ui/Banner';
import { buttonVariants } from '@/components/ui/button/buttonVariants';
import type { Comment } from '@/graphql';
import { useCommentFeed } from '@/components/feed/useCommentFeed';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DashboardWidget } from '../DashboardWidget';

/**
 * Highlights the most recent feed post as "post of the day".
 */
export function PostOfTheDayWidget() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useCommentFeed({});

  const post = data?.pages?.[0]?.commentFeed?.comments?.[0] ?? null;

  return (
    <DashboardWidget title={t('dashboard:postOfTheDay')}>
      {isLoading && (
        <p className="text-muted-foreground py-6 text-center text-sm">
          {t('posts:loadingFeed')}
        </p>
      )}

      {isError && (
        <Banner message={t('errors:feedLoadFailed')} variant="negative" />
      )}

      {!isLoading && !isError && !post && (
        <p className="text-muted-foreground py-6 text-center text-sm">
          {t('posts:emptyFeed')}
        </p>
      )}

      {post && (
        <div className="flex flex-col gap-3">
          <PostHeader comment={post as Comment} showContextMenu={false} />
          <CommentBody
            body={post.body}
            weblinks={(post as Comment).weblinks}
            className="text-foreground line-clamp-4 text-sm"
            linkPreviewVariant="compact"
          />
          <Link
            to="/post/$id"
            params={{ id: post.id }}
            className={buttonVariants({
              variant: 'secondary',
              size: 'sm',
              className: 'w-fit',
            })}
          >
            {t('dashboard:viewPost')}
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      )}
    </DashboardWidget>
  );
}
