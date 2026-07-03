import { CreatePost } from '@/components/create/CreatePost';
import { CommentFeed, FeedStreamHeader } from '@/components/feed';
import { useTranslation } from 'react-i18next';

/**
 * Feed page with create post form and live posts.
 */
export function Home() {
  const { t } = useTranslation();

  return (
    <>
      <FeedStreamHeader>{t('navigation:feed')}</FeedStreamHeader>

      <CreatePost />

      <CommentFeed filter={{}} />
    </>
  );
}
