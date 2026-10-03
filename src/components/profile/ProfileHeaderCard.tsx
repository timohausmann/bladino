import { formatLastSeen } from '@/components/presence/mapPresenceUsers';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/Card';
import { CyclingText } from '@/components/ui/CyclingText';
import { VIEW_TRANSITION_TYPES } from '@/constants/viewTransitions';
import { useUserStore } from '@/stores/userStore';
import { formatJoinDate, type ApiDate } from '@/utils/formatDate';
import { resolveAvatarUrl } from '@/utils/avatarUrl';
import { runViewTransition } from '@/utils/runViewTransition';
import clsx from 'clsx';
import { Calendar, Clock, MessageSquare, Pencil, UserPlus } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileAvatarEditor } from './ProfileAvatarEditor';

const PROFILE_HEADER_VIEW_TRANSITION = VIEW_TRANSITION_TYPES.profileHeader;

interface ProfileHeaderUser {
  id: string;
  name: string;
  avatar?: string | null;
  description?: string | null;
  dateCreated?: ApiDate;
  lastAction?: ApiDate;
  commentCount?: number | null;
}

interface ProfileHeaderCardProps {
  user: ProfileHeaderUser;
  className?: string;
}

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

  return formatJoinDate(lastAction);
}

/**
 * Profile header: banner, avatar, and meta.
 * The signed-in user can switch their own card into avatar editing.
 */
export function ProfileHeaderCard({ user, className }: ProfileHeaderCardProps) {
  const { t } = useTranslation();
  const currentUserId = useUserStore((store) => store.currentUser?.id);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  const canEditAvatar = currentUserId != null && currentUserId === user.id;
  const showEditor = canEditAvatar && isEditingAvatar;

  useEffect(() => {
    setIsEditingAvatar(false);
  }, [user.id]);

  const updateAvatarEditMode = useCallback((isEditing: boolean) => {
    runViewTransition({
      type: PROFILE_HEADER_VIEW_TRANSITION,
      update: () => {
        setIsEditingAvatar(isEditing);
      },
    });
  }, []);

  const handleEditAvatar = () => updateAvatarEditMode(true);

  const handleCancelEdit = useCallback(
    () => updateAvatarEditMode(false),
    [updateAvatarEditMode],
  );

  const handleSaveAvatar = useCallback(() => {
    // Cropped upload is a later step. Save only leaves edit mode for now.
    updateAvatarEditMode(false);
  }, [updateAvatarEditMode]);

  const profileMetaLines = useMemo((): ReactNode[] => {
    const lastSeen = user.lastAction
      ? formatLastSeenOnline(user.lastAction)
      : '';
    const lines: ReactNode[] = [];

    if (user.commentCount != null) {
      lines.push(
        <span key="posts" className="flex items-center gap-2">
          <MessageSquare size={16} />
          <span>{t('profile:postCount', { count: user.commentCount })}</span>
        </span>,
      );
    }

    if (user.dateCreated != null) {
      lines.push(
        <span key="joined" className="flex items-center gap-2">
          <Calendar size={16} />
          <span>
            {t('profile:joined', {
              date: formatJoinDate(user.dateCreated),
            })}
          </span>
        </span>,
      );
    }

    if (lastSeen) {
      lines.push(
        <span key="last-seen" className="flex items-center gap-2">
          <Clock size={16} />
          <span>{t('profile:lastSeenOnline', { time: lastSeen })}</span>
        </span>,
      );
    }

    return lines;
  }, [user, t]);

  const handle = 'handle';
  const showHandle = false;
  const avatarAlt = t('common:userAvatar', { name: user.name });

  return (
    <Card
      className={clsx('relative overflow-hidden p-0', className)}
      viewTransitionName={PROFILE_HEADER_VIEW_TRANSITION}
    >
      {showEditor ? (
        <ProfileAvatarEditor
          image={resolveAvatarUrl(user.avatar)}
          onCancel={handleCancelEdit}
          onSave={handleSaveAvatar}
        />
      ) : (
        <>
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <div className="relative -mt-16 mb-4 ml-6">
            {canEditAvatar ? (
              <button
                type="button"
                onClick={handleEditAvatar}
                aria-label={t('profile:editAvatar')}
                className={clsx(
                  'group relative rounded-full border-none bg-transparent p-0',
                  'focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none',
                  'focus-visible:ring-offset-background focus-visible:ring-offset-2',
                )}
              >
                <Avatar
                  avatar={user.avatar}
                  alt=""
                  className="border-background h-32 w-32 border-2"
                />
                <span
                  className={clsx(
                    'pointer-events-none absolute inset-0 flex items-center justify-center rounded-full',
                    'bg-black/40 text-white opacity-0 transition-opacity duration-200',
                    'group-hover:opacity-100 group-focus-visible:opacity-100',
                  )}
                >
                  <Pencil size={28} />
                </span>
              </button>
            ) : (
              <Avatar
                avatar={user.avatar}
                alt={avatarAlt}
                className="border-background h-32 w-32 border-2"
              />
            )}
          </div>

          <div className="px-6 pb-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="text-foreground text-2xl font-bold">
                  {user.name}
                </h1>
                {showHandle && (
                  <p className="text-muted-foreground text-lg">@{handle}</p>
                )}
              </div>

              <Button
                type="button"
                variant="secondary"
                iconBefore={<UserPlus size={16} />}
                disabled
              >
                {t('profile:follow')}
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
        </>
      )}
    </Card>
  );
}
