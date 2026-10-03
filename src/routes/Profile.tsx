import { CommentFeed } from '@/components/feed';
import { ProfileHeaderCard } from '@/components/profile';
import { Card } from '@/components/ui/Card';
import { ResourceError } from '@/components/ui/ResourceError';
import { ResourceNotFound } from '@/components/ui/ResourceNotFound';
import {
  UserDirectoryDocument,
  UserProfileDocument,
  useGraphQLQuery,
} from '@/graphql';
import { useParams } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Profile - User profile page component
 */
export function Profile() {
  const { t } = useTranslation();
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

  if (isLoadingDirectory || (userId && isLoadingProfile)) {
    return (
      <Card className="py-12 text-center">
        <p className="text-muted-foreground">{t('profile:loading')}</p>
      </Card>
    );
  }

  if (isDirectoryError || isProfileError) {
    return <ResourceError resource="user" />;
  }

  if (!userId || !user) {
    return <ResourceNotFound resource="user" detail={profileName} />;
  }

  return (
    <>
      <ProfileHeaderCard user={user} className="mb-6" />

      <CommentFeed
        filter={{ user: user.id }}
        title={t('profile:postsBy', { name: user.name })}
        emptyMessage={t('profile:emptyPosts', { name: user.name })}
      />
    </>
  );
}
