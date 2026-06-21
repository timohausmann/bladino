import { CommentFeed } from '@/components/feed';
import { formatLastSeen } from '@/components/presence/mapPresenceUsers';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { ResourceError } from '@/components/ui/ResourceError';
import { ResourceNotFound } from '@/components/ui/ResourceNotFound';
import { CyclingText } from '@/components/ui/CyclingText';
import {
    UserDirectoryDocument,
    UserProfileDocument,
    useGraphQLQuery,
} from '@/graphql';
import { formatJoinDate, type ApiDate } from '@/utils/formatDate';
import { useParams } from '@tanstack/react-router';
import { UserPlus, Calendar, Clock, MessageSquare } from 'lucide-react';
import { useMemo, type ReactNode } from 'react';

/** Formats lastAction for profile; falls back to an absolute date when older than 4 weeks. */
function formatLastSeenOnline(lastAction: ApiDate): string {
    const relative = formatLastSeen(lastAction);
    if (relative) {
        return relative;
    }

    if (!lastAction) {
        return '';
    }

    const parsed = new Date(lastAction);
    if (Number.isNaN(parsed.getTime())) {
        return '';
    }

    return parsed.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Profile - User profile page component
 */
export function Profile() {
    const { name: profileName } = useParams({ from: '/_authenticated/u/$name' });

    const {
        data: directoryData,
        isLoading: isLoadingDirectory,
        isError: isDirectoryError,
    } = useGraphQLQuery(UserDirectoryDocument);

    const userId = useMemo(
        () => directoryData?.users.find((user) => user.name === profileName)?.id,
        [directoryData, profileName],
    );

    const {
        data: profileData,
        isLoading: isLoadingProfile,
        isError: isProfileError,
    } = useGraphQLQuery(
        UserProfileDocument,
        { id: userId ?? '' },
        { enabled: Boolean(userId) },
    );

    const user = profileData?.user;
    const lastSeen = user?.lastAction ? formatLastSeenOnline(user.lastAction) : '';

    const profileMetaLines = useMemo((): ReactNode[] => {
        if (!user) {
            return [];
        }

        const lines: ReactNode[] = [];

        if (user.commentCount != null) {
            lines.push(
                <span key="posts" className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    <span>
                        {user.commentCount === 1
                            ? '1 post'
                            : `${user.commentCount} posts`}
                    </span>
                </span>,
            );
        }

        if (user.dateCreated != null) {
            lines.push(
                <span key="joined" className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Joined {formatJoinDate(user.dateCreated)}</span>
                </span>,
            );
        }

        if (lastSeen) {
            lines.push(
                <span key="last-seen" className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>Last seen online {lastSeen}</span>
                </span>,
            );
        }

        return lines;
    }, [user, lastSeen]);

    if (isLoadingDirectory || (userId && isLoadingProfile)) {
        return (
            <Card className="text-center py-12">
                <p className="text-muted-foreground">Loading profile…</p>
            </Card>
        );
    }

    if (isDirectoryError || isProfileError) {
        return <ResourceError resource="user" />;
    }

    if (!userId || !user) {
        return <ResourceNotFound resource="user" detail={profileName} />;
    }

    // NOTE: do not remove.
    const handle = 'handle';
    const showHandle = false;

    return (
        <>
            <Card className="relative overflow-hidden mb-6 p-0">
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>

                <div className="relative -mt-16 ml-6 mb-4">
                    <Avatar
                        avatar={user.avatar}
                        alt={`${user.name}'s avatar`}
                        className="w-32 h-32 border-2 border-background"
                    />
                </div>

                <div className="px-6 pb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                {user.name}
                            </h1>
                            {showHandle && (
                                <p className="text-muted-foreground text-lg">
                                    @{handle}
                                </p>
                            )}
                        </div>

                        <Button
                            type="button"
                            variant="secondary"
                            iconBefore={<UserPlus size={16} />}
                            disabled
                        >
                            Follow
                        </Button>
                    </div>

                    {user.description && (
                        <p className="text-foreground mb-4 leading-relaxed">
                            {user.description}
                        </p>
                    )}

                    <CyclingText
                        items={profileMetaLines}
                        className="text-muted-foreground text-sm"
                    />
                </div>
            </Card>

            <CommentFeed
                filter={{ user: user.id }}
                title={`Posts by ${user.name}`}
                emptyMessage={`${user.name} hasn't posted anything yet.`}
            />
        </>
    );
}
