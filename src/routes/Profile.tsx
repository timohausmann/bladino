import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/post/PostCard';
import { Avatar } from '@/components/ui/Avatar';
import { Back } from '@/components/ui/Back';
import { Card } from '@/components/ui/Card';
import { getCommentsByUserId } from '@/mocks/posts';
import { getUserByName } from '@/mocks/users';
import { formatJoinDate } from '@/utils/formatDate';
import { useParams } from '@tanstack/react-router';
import { Calendar, UserPlus } from 'lucide-react';

/**
 * Profile - User profile page component
 */
export function Profile() {
    const { name: profileName } = useParams({ from: '/_authenticated/u/$name' });
    const user = getUserByName(profileName);

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="text-center py-12">
                    <h1 className="text-2xl font-bold text-foreground mb-4">User Not Found</h1>
                    <p className="text-muted-foreground">The user {profileName} doesn't exist.</p>
                </Card>
            </div>
        );
    }

    const userComments = getCommentsByUserId(user.id);
    const handle = 'handle';
    const showHandle = false;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">

            <Back />

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
                            variant="primary"
                            iconBefore={<UserPlus size={16} />}
                        >
                            Follow
                        </Button>
                    </div>

                    {user.description && (
                        <p className="text-foreground mb-4 leading-relaxed">
                            {user.description}
                        </p>
                    )}

                    {user.dateCreated != null && (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Calendar size={16} />
                            <span>Joined {formatJoinDate(user.dateCreated)}</span>
                        </div>
                    )}
                </div>
            </Card>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground">
                    Posts by {user.name}
                </h2>

                {userComments.length > 0 ? (
                    userComments.map((comment) => (
                        <PostCard
                            key={comment.id}
                            comment={comment}
                        />
                    ))
                ) : (
                    <Card className="text-center py-12">
                        <p className="text-muted-foreground">
                            {user.name} hasn't posted anything yet.
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
}
