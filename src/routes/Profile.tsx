import { Button } from '@/components/form/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Back } from '@/components/ui/Back';
import { Card } from '@/components/ui/Card';
import { PostDetailCard } from '@/components/ui/PostDetailCard';
import { getPostsByUserId } from '@/mocks/posts';
import { getUserByHandle } from '@/mocks/users';
import { useParams } from '@tanstack/react-router';
import { Calendar, UserPlus } from 'react-feather';

/**
 * Profile - User profile page component
 */
export function Profile() {
    const { handle } = useParams({ from: '/u/$handle' });

    // Get user data by handle
    const user = getUserByHandle(handle);

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="text-center py-12">
                    <h1 className="text-2xl font-bold text-foreground mb-4">User Not Found</h1>
                    <p className="text-muted-foreground">The user @{handle} doesn't exist.</p>
                </Card>
            </div>
        );
    }

    // Get posts by this user
    const userPosts = getPostsByUserId(user.id);

    // Format join date
    const formatJoinDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">

            <Back />

            {/* Profile Card */}
            <Card className="relative overflow-hidden mb-6 p-0">
                {/* Banner Image */}
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    {/* You can replace this with an actual banner image */}
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Avatar - Half overlapping the banner */}
                <div className="relative -mt-16 ml-6 mb-4">
                    <Avatar
                        src={user.avatar}
                        alt={`${user.name}'s avatar`}
                        className="w-32 h-32 border-2 border-background"
                    />
                </div>

                {/* Profile Info */}
                <div className="px-6 pb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                {user.name}
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                @{user.handle}
                            </p>
                        </div>

                        {/* Follow Button */}
                        <Button
                            type="button"
                            className="flex items-center gap-2"
                        >
                            <UserPlus size={16} />
                            Follow
                        </Button>
                    </div>

                    {/* Bio */}
                    {user.bio && (
                        <p className="text-foreground mb-4 leading-relaxed">
                            {user.bio}
                        </p>
                    )}

                    {/* Join Date */}
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar size={16} />
                        <span>Joined {formatJoinDate(user.joinDate)}</span>
                    </div>
                </div>
            </Card>

            {/* User's Posts */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground">
                    Posts by {user.name}
                </h2>

                {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                        <PostDetailCard
                            key={post.id}
                            post={post}
                        />
                    ))
                ) : (
                    <Card className="text-center py-12">
                        <p className="text-muted-foreground">
                            @{user.handle} hasn't posted anything yet.
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
}
