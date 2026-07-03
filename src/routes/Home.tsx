import { CreatePost } from '@/components/create/CreatePost';
import { CommentFeed } from '@/components/feed';

/**
 * Feed page with create post form and live posts.
 */
export function Home() {
  return (
    <>
      <CreatePost />

      <CommentFeed filter={{}} />
    </>
  );
}
