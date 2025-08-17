/**
 * User profile interface
 */
export interface User {
  id: string;
  avatar: string;
  name: string;
  handle: string;
  bio: string;
  joinDate: Date;
  email?: string; // Optional, not public
}
