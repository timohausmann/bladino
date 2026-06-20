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
        <div className="flex-1 py-8">
            <div className="container max-w-3xl mx-auto px-4 flex flex-col gap-8">
                <CreatePost />

                <PresenceRail users={presenceData?.usersLastAction ?? []} />

                <CommentFeed filter={{}} />
            </div>
        </div>
    );
}
