import { CreatePost } from '@/components/create/CreatePost';
import { CommentFeed } from '@/components/feed';
import { PresenceRail } from '@/components/presence';
import { UsersLastActionDocument, useGraphQLQuery } from '@/graphql';

/**
 * Home page component displaying create post form and live feed posts
 */
export function Home() {
    const { data: presenceData } = useGraphQLQuery(UsersLastActionDocument);

    return (
        <>
            <CreatePost />

            <PresenceRail users={presenceData?.usersLastAction ?? []} />

            <CommentFeed filter={{}} />
        </>
    );
}
