export const VIEW_TRANSITION_TYPES = {
  profileHeader: 'profile-header',
} as const;

export type ViewTransitionType =
  (typeof VIEW_TRANSITION_TYPES)[keyof typeof VIEW_TRANSITION_TYPES];
